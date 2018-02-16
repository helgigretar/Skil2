CREATE TABLE public.tafla
(
    id SERIAL NOT NULL,
    date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name character varying(99),
    email character varying(99),
    ssn character varying(99),
    amount integer,
    CONSTRAINT tafla_pkey PRIMARY KEY (id)
)