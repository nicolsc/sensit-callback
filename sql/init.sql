
drop table if exists sensit_request_logs;
drop table if exists sensit_data;

drop type if exists sensorType;

create type sensorType as enum('temperature', 'motion', 'sound','button');

create table if not exists sensit_request_logs(
  id serial primary key,
  date timestamp not null,
  method varchar(4),
  path varchar(50),
  data json not null
);


create table if not exists sensit_data(
  id serial primary key,
  deviceid integer not null,
  sensorid integer not null,
  type sensorType,
  date timestamp not null,
  receivedat timestamp not null,
  value varchar(12) not null
);