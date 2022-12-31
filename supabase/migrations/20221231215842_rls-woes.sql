alter table "public"."charts" disable row level security;

alter table "public"."houses" disable row level security;

alter table "public"."planets" disable row level security;

create policy "Enable read access for all users"
on "public"."charts"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."houses"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."planets"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."profiles"
as permissive
for update
to public
using ((auth.email() = (email)::text))
with check ((auth.email() = (email)::text));



