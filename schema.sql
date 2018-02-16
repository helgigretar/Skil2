CREATE TABLE Tafla
(
    id serial primary key,
    date timestamp with time zone not null default current_timestamp,
    name varchar(99),
    email varchar(99),
    ssn varchar(99),
    amount INT
);