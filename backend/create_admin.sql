DO $$ 
DECLARE
    new_user_id BIGINT;
BEGIN
    SELECT id INTO new_user_id FROM users WHERE email = 'nazifiibrahim003@gmail.com';
    
    IF new_user_id IS NULL THEN
        INSERT INTO users (name, email, password, created_at, updated_at)
        VALUES ('Admin', 'nazifiibrahim003@gmail.com', '$2y$10$O5PPHbzPecU4aFKQhiwlY.JP2ONlq2jDteXrkAMLYEx0Sf77MREEW', NOW(), NOW())
        RETURNING id INTO new_user_id;
    ELSE
        UPDATE users SET password = '$2y$10$O5PPHbzPecU4aFKQhiwlY.JP2ONlq2jDteXrkAMLYEx0Sf77MREEW' WHERE id = new_user_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = new_user_id AND role = 'admin') THEN
        INSERT INTO user_roles (user_id, role, created_at, updated_at)
        VALUES (new_user_id, 'admin', NOW(), NOW());
    END IF;
END $$;
