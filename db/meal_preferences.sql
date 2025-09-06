create table public.meal_preferences (
    created_at timestamp with time zone not null default now(),
    user_id text not null,
    calories numeric null,
    protein numeric null,
    meals jsonb null,
    diets jsonb null,
    allergens jsonb null,
    constraint meal_preferences_pkey primary key (user_id),
    constraint meal_preferences_user_id_key unique (user_id)
) TABLESPACE pg_default;