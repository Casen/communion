create table "public"."charts" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "name" character varying default ''::character varying,
    "birth_place_id" character varying,
    "birth_place" character varying,
    "birth_time" timestamp with time zone,
    "birth_lat" double precision,
    "birth_lng" double precision,
    "earth" smallint,
    "water" smallint,
    "fire" smallint,
    "air" smallint,
    "enneagram" smallint,
    "created_at" timestamp with time zone default now(),
    "is_primary" boolean default false
);


alter table "public"."charts" enable row level security;

create table "public"."houses" (
    "id" uuid not null default uuid_generate_v4(),
    "position" smallint,
    "zodiac_name" character varying default ''::character varying,
    "chart_id" uuid not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."houses" enable row level security;

create table "public"."planets" (
    "id" uuid not null default uuid_generate_v4(),
    "chart_id" uuid not null,
    "name" character varying not null default ''::character varying,
    "lng" double precision not null,
    "zodiac_name" character varying default ''::character varying,
    "zodiac_degrees" double precision,
    "house" smallint,
    "nak_name" character varying,
    "nak_sex" character varying,
    "nak_animal" character varying,
    "created_at" timestamp with time zone default now()
);


alter table "public"."planets" enable row level security;

alter table "public"."profiles" drop column "birth_lat";

alter table "public"."profiles" drop column "birth_lng";

alter table "public"."profiles" drop column "birth_place";

alter table "public"."profiles" drop column "birth_place_id";

alter table "public"."profiles" drop column "birth_time";

alter table "public"."profiles" add column "ip" character varying;

alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX chart_pkey ON public.charts USING btree (id);

CREATE UNIQUE INDEX houses_pkey ON public.houses USING btree (id);

CREATE UNIQUE INDEX planets_pkey ON public.planets USING btree (id);

alter table "public"."charts" add constraint "chart_pkey" PRIMARY KEY using index "chart_pkey";

alter table "public"."houses" add constraint "houses_pkey" PRIMARY KEY using index "houses_pkey";

alter table "public"."planets" add constraint "planets_pkey" PRIMARY KEY using index "planets_pkey";

alter table "public"."charts" add constraint "charts_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."charts" validate constraint "charts_profile_id_fkey";

alter table "public"."houses" add constraint "houses_chart_id_fkey" FOREIGN KEY (chart_id) REFERENCES charts(id) not valid;

alter table "public"."houses" validate constraint "houses_chart_id_fkey";

alter table "public"."planets" add constraint "planets_chart_id_fkey" FOREIGN KEY (chart_id) REFERENCES charts(id) not valid;

alter table "public"."planets" validate constraint "planets_chart_id_fkey";


