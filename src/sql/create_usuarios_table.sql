-- Create the 'usuarios' table
create table if not exists usuarios (
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
-- Drop existing policies if present (for re-running this script)
drop policy if exists "Public Access" on usuarios;
drop policy if exists "Allow public read" on usuarios;
drop policy if exists "Allow public insert" on usuarios;
drop policy if exists "Allow public update" on usuarios;
-- Create separate policies for each operation
-- SELECT: permite que qualquer pessoa leia usuários
create policy "Allow public read" on usuarios for
select using (true);
-- INSERT: permite que qualquer pessoa crie um novo cadastro
create policy "Allow public insert" on usuarios for
insert with check (true);
-- UPDATE: permite que qualquer pessoa atualize (para futuro uso)
create policy "Allow public update" on usuarios for
update using (true) with check (true);
