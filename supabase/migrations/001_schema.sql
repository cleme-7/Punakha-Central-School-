create extension if not exists pgcrypto;
create type user_role as enum ('admin','teacher','student','parent');
create type ann_category as enum ('Exam','Holiday','Event','Urgent','Report','General');
create type tournament_status as enum ('upcoming','registration_open','ongoing','completed');

create table profiles (id uuid primary key references auth.users on delete cascade, full_name text, role user_role not null default 'student', created_at timestamptz default now());
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create table settings (key text primary key, value boolean not null);
insert into settings values ('show_full_names', false);
create table classes (id serial primary key, grade int not null check (grade between 1 and 12), section text not null, unique (grade, section));
create table students (id uuid primary key default gen_random_uuid(), profile_id uuid references profiles(id), full_name text not null, roll_no text not null, class_id int not null references classes(id), unique (class_id, roll_no));
create table exams (id serial primary key, academic_year text not null, term text not null, held_on date not null, unique (academic_year, term));
create table rankings (id uuid primary key default gen_random_uuid(), exam_id int not null references exams(id) on delete cascade, student_id uuid not null references students(id) on delete cascade, subject text, total_marks numeric not null, percentage numeric not null, grade text, remarks text, unique nulls not distinct (exam_id, student_id, subject));
create table announcements (id uuid primary key default gen_random_uuid(), title text not null, category ann_category not null default 'General', summary text, body text not null, attachments text[] not null default '{}', pinned boolean not null default false, published_on date not null default current_date, created_by uuid references profiles(id));
create table sports (id serial primary key, name text unique not null);
create table tournaments (id uuid primary key default gen_random_uuid(), sport text not null, title text not null, starts_on date not null, ends_on date, venue text, register_by date, status tournament_status not null default 'upcoming');
create table champions (id uuid primary key default gen_random_uuid(), sport text not null, year int not null, team_or_individual text not null, achievement text, photo_url text);
create table registrations (id uuid primary key default gen_random_uuid(), tournament_id uuid not null references tournaments(id) on delete cascade, student_name text not null, grade int not null, section text not null, roll_no text not null, team_name text, guardian_contact text not null, email text not null, emergency_contact text not null, consent boolean not null check (consent), created_at timestamptz not null default now(), unique (tournament_id, grade, section, roll_no));

-- Public view: initials only unless settings.show_full_names is true. Runs with owner rights on purpose so students stay private.
create view ranking_board as
select r.id, r.exam_id, e.academic_year, e.term, s.class_id, c.grade, c.section, s.roll_no,
  case when (select value from settings where key = 'show_full_names') then s.full_name
       else regexp_replace(initcap(s.full_name), '([A-Za-z])[a-z]*\s*', '\1.', 'g') end as display_name,
  r.subject, r.total_marks, r.percentage, r.grade as grade_letter, r.remarks,
  rank() over (partition by r.exam_id, s.class_id, coalesce(r.subject, '') order by r.percentage desc) as "rank"
from rankings r join students s on s.id = r.student_id join classes c on c.id = s.class_id join exams e on e.id = r.exam_id;
grant select on ranking_board to anon, authenticated;

create function is_role(r user_role[]) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role = any (r)) $$;

alter table profiles enable row level security;
create policy "own or admin" on profiles for select using (id = auth.uid() or is_role('{admin}'));

do $$ declare t text; begin
  foreach t in array array['exams','students','rankings'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "staff manage" on %I for all using (is_role(''{admin,teacher}'')) with check (is_role(''{admin,teacher}''))', t);
  end loop;
  foreach t in array array['announcements','classes','sports','tournaments','champions','settings','registrations'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "admin manage" on %I for all using (is_role(''{admin}'')) with check (is_role(''{admin}''))', t);
  end loop;
  foreach t in array array['announcements','classes','sports','tournaments','champions','exams'] loop
    execute format('create policy "public read" on %I for select using (true)', t);
  end loop;
end $$;

create policy "public register" on registrations for insert with check (
  consent and exists (select 1 from tournaments t where t.id = tournament_id and t.status = 'registration_open' and (t.register_by is null or t.register_by >= current_date)));
