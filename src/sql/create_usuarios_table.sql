-- Create the 'usuarios' table
create table usuarios (
    cpf text primary key,
    senha text not null,
    nome text not null,
    crp text,
    unidade text,
    avatar_url text,
    perfil text not null check (
        perfil in ('admin', 'tecnico', 'Psicólogo Social')
    )
);
-- Enable Row Level Security (RLS)
alter table usuarios enable row level security;
-- Create a policy that allows anyone to read/insert (since we are handling auth manually for now without Supabase Auth UI)
-- WARNING: In a production environment with sensitive data, you would want stricter policies.
create policy "Public Access" on usuarios for all using (true) with check (true);
