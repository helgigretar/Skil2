CREATE TABLE public.tafla
(
    id SERIAL NOT NULL,
    date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name character varying(99) COLLATE pg_catalog."default",
    email character varying(99) COLLATE pg_catalog."default",
    ssn character varying(99) COLLATE pg_catalog."default",
    amount integer,
    CONSTRAINT tafla_pkey PRIMARY KEY (id)
)