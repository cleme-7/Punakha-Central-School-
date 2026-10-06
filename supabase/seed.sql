insert into classes(grade, section) values (6,'A'),(6,'B'),(10,'A');
insert into exams(academic_year, term, held_on) values ('2026','Mid-term','2026-06-20'),('2025','Annual','2025-12-10');
insert into students(full_name, roll_no, class_id)
select v.n, v.r, c.id from (values ('Karma Dorji','1',6,'A'),('Pema Choden','2',6,'A'),('Tshering Wangmo','3',6,'A'),('Sonam Tobgay','4',6,'B'),('Dechen Lhamo','5',6,'B'),('Ugyen Tenzin','6',10,'A')) v(n,r,g,s)
join classes c on c.grade = v.g and c.section = v.s;
insert into rankings(exam_id, student_id, subject, total_marks, percentage, grade, remarks)
select e.id, s.id, v.sub, v.t, v.p, v.gr, v.rm from (values
 ('1',null,534,89.0,'A+','Excellent'),('2',null,521,86.8,'A+','Very good'),('3',null,498,83.0,'A','Good'),
 ('4',null,476,79.3,'A','Good'),('5',null,455,75.8,'B+','Keep improving'),('6',null,512,85.3,'A+','Excellent'),
 ('1','Mathematics',92,92.0,'A+',null),('2','English',90,90.0,'A+',null)) v(r,sub,t,p,gr,rm)
join students s on s.roll_no = v.r cross join exams e where e.term = 'Mid-term';
insert into announcements(title, category, summary, body, pinned) values
('Mid-term results published','Exam','Results are now on the Rankings page.','Mid-term examination results for all classes are now available on the Academic Rankings page.',true),
('Winter break schedule','Holiday','Dates will be confirmed by the school office.','The school office will confirm the winter break dates after the Annual Examinations.',false),
('Inter-House Football registration open','Event','Register your team by 18 October.','Students can register for the Inter-House Football tournament from the Sports page.',false);
insert into sports(name) values ('Football'),('Archery'),('Athletics');
insert into tournaments(sport, title, starts_on, ends_on, venue, register_by, status) values
('Football','Inter-House Football','2026-10-25','2026-10-30','School ground','2026-10-18','registration_open'),
('Archery','Zonal Archery Meet','2026-11-08','2026-11-09','Punakha archery range','2026-10-30','registration_open'),
('Athletics','Annual Athletics Meet','2026-10-01','2026-10-10','School ground',null,'ongoing');
insert into champions(sport, year, team_or_individual, achievement) values
('Archery',2025,'Pema Choden','Zonal individual champion'),('Football',2024,'Druk House','Inter-House champions'),('Athletics',2025,'Ugyen Tenzin','100m district gold');
