-- Corrigir as unidades no Supabase
-- Executar no SQL Editor do Supabase Dashboard
-- 1. Limpar todas as unidades existentes
DELETE FROM unidades;
-- 2. Inserir as 7 unidades corretas
INSERT INTO unidades (id, nome, tipo, endereco)
VALUES (1, 'CSMI João XXIII', 'CSMI', 'João XXIII'),
    (
        2,
        'CSMI Cristo Redentor',
        'CSMI',
        'Cristo Redentor'
    ),
    (3, 'CSMI Curió', 'CSMI', 'Curió'),
    (4, 'CSMI Barbalha', 'CSMI', 'Barbalha'),
    (
        5,
        'Espaço Social Quintino Cunha',
        'Espaço Social',
        'Quintino Cunha'
    ),
    (
        6,
        'Espaço Social Barra do Ceará',
        'Espaço Social',
        'Barra do Ceará'
    ),
    (
        7,
        'Espaço Social Dias Macedo',
        'Espaço Social',
        'Dias Macedo'
    );
