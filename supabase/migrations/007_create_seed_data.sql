-- Seed data for MealAdvisor application
-- This file contains initial data for testing and development

-- Insert curated recipes for fallback content
INSERT INTO public.recipes (
  id,
  user_id,
  title,
  description,
  cuisine_type,
  meal_type,
  difficulty_level,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  calories,
  protein_g,
  carbs_g,
  fat_g,
  fiber_g,
  sugar_g,
  sodium_mg,
  ingredients,
  instructions,
  equipment,
  dietary_tags,
  allergen_info,
  spice_level,
  is_public,
  is_curated,
  is_verified,
  ai_generated
) VALUES 
-- Breakfast Recipes
(
  '550e8400-e29b-41d4-a716-446655440001',
  NULL,
  'Classic Scrambled Eggs',
  'Fluffy and creamy scrambled eggs made with butter and milk',
  'American',
  ARRAY['breakfast'],
  'easy',
  5,
  8,
  2,
  320,
  24.5,
  2.8,
  22.1,
  0.0,
  2.5,
  480,
  '[
    {"name": "Large eggs", "amount": 4, "unit": "pieces", "notes": "Room temperature works best"},
    {"name": "Whole milk", "amount": 2, "unit": "tablespoons", "notes": "Can substitute with cream"},
    {"name": "Butter", "amount": 1, "unit": "tablespoon", "notes": "Unsalted preferred"},
    {"name": "Salt", "amount": 0.25, "unit": "teaspoon", "notes": "To taste"},
    {"name": "Black pepper", "amount": 0.125, "unit": "teaspoon", "notes": "Freshly ground"}
  ]',
  '[
    {"step": 1, "instruction": "Crack eggs into a bowl and whisk with milk, salt, and pepper until well combined", "duration_minutes": 2},
    {"step": 2, "instruction": "Heat butter in a non-stick pan over medium-low heat", "duration_minutes": 1},
    {"step": 3, "instruction": "Pour egg mixture into the pan and let it sit for 30 seconds", "duration_minutes": 1},
    {"step": 4, "instruction": "Gently stir with a wooden spoon, pushing eggs from edges to center", "duration_minutes": 3},
    {"step": 5, "instruction": "Continue stirring gently until eggs are just set but still creamy", "duration_minutes": 2},
    {"step": 6, "instruction": "Remove from heat and serve immediately", "duration_minutes": 1}
  ]',
  ARRAY['non-stick pan', 'whisk', 'wooden spoon'],
  ARRAY['vegetarian', 'gluten-free', 'low-carb'],
  ARRAY['eggs', 'dairy'],
  'mild',
  TRUE,
  TRUE,
  TRUE,
  FALSE
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  NULL,
  'Overnight Oats with Berries',
  'Healthy and convenient overnight oats topped with fresh berries',
  'American',
  ARRAY['breakfast'],
  'easy',
  10,
  0,
  1,
  380,
  12.5,
  65.2,
  8.9,
  11.5,
  15.8,
  95,
  '[
    {"name": "Rolled oats", "amount": 0.5, "unit": "cup", "notes": "Old-fashioned oats work best"},
    {"name": "Greek yogurt", "amount": 0.25, "unit": "cup", "notes": "Plain, unsweetened"},
    {"name": "Milk", "amount": 0.5, "unit": "cup", "notes": "Any type - almond, dairy, etc."},
    {"name": "Chia seeds", "amount": 1, "unit": "tablespoon", "notes": "Optional but adds nutrition"},
    {"name": "Honey", "amount": 1, "unit": "tablespoon", "notes": "Can substitute with maple syrup"},
    {"name": "Vanilla extract", "amount": 0.5, "unit": "teaspoon", "notes": "Pure vanilla preferred"},
    {"name": "Mixed berries", "amount": 0.5, "unit": "cup", "notes": "Fresh or frozen"}
  ]',
  '[
    {"step": 1, "instruction": "In a jar or container, combine oats, yogurt, milk, chia seeds, honey, and vanilla", "duration_minutes": 3},
    {"step": 2, "instruction": "Stir well to combine all ingredients", "duration_minutes": 1},
    {"step": 3, "instruction": "Cover and refrigerate overnight or at least 4 hours", "duration_minutes": 1},
    {"step": 4, "instruction": "In the morning, stir the oats", "duration_minutes": 1},
    {"step": 5, "instruction": "Top with fresh berries and enjoy cold or at room temperature", "duration_minutes": 2}
  ]',
  ARRAY['jar or container', 'spoon'],
  ARRAY['vegetarian', 'high-fiber', 'healthy'],
  ARRAY['dairy', 'may contain gluten'],
  'mild',
  TRUE,
  TRUE,
  TRUE,
  FALSE
),

-- Lunch Recipes
(
  '550e8400-e29b-41d4-a716-446655440003',
  NULL,
  'Mediterranean Chicken Salad',
  'Fresh and healthy Mediterranean-inspired chicken salad with vegetables and feta',
  'Mediterranean',
  ARRAY['lunch', 'dinner'],
  'easy',
  15,
  0,
  2,
  420,
  35.8,
  12.4,
  25.6,
  6.2,
  8.9,
  680,
  '[
    {"name": "Cooked chicken breast", "amount": 8, "unit": "ounces", "notes": "Grilled or roasted, diced"},
    {"name": "Mixed greens", "amount": 4, "unit": "cups", "notes": "Arugula, spinach, lettuce mix"},
    {"name": "Cherry tomatoes", "amount": 1, "unit": "cup", "notes": "Halved"},
    {"name": "Cucumber", "amount": 1, "unit": "medium", "notes": "Diced"},
    {"name": "Red onion", "amount": 0.25, "unit": "cup", "notes": "Thinly sliced"},
    {"name": "Feta cheese", "amount": 0.5, "unit": "cup", "notes": "Crumbled"},
    {"name": "Kalamata olives", "amount": 0.25, "unit": "cup", "notes": "Pitted and halved"},
    {"name": "Olive oil", "amount": 3, "unit": "tablespoons", "notes": "Extra virgin"},
    {"name": "Lemon juice", "amount": 2, "unit": "tablespoons", "notes": "Fresh squeezed"},
    {"name": "Dried oregano", "amount": 1, "unit": "teaspoon", "notes": "Mediterranean oregano preferred"},
    {"name": "Salt", "amount": 0.5, "unit": "teaspoon", "notes": "To taste"},
    {"name": "Black pepper", "amount": 0.25, "unit": "teaspoon", "notes": "To taste"}
  ]',
  '[
    {"step": 1, "instruction": "In a large bowl, combine mixed greens, cherry tomatoes, cucumber, and red onion", "duration_minutes": 5},
    {"step": 2, "instruction": "Add diced chicken breast to the vegetables", "duration_minutes": 2},
    {"step": 3, "instruction": "Sprinkle crumbled feta cheese and olives over the salad", "duration_minutes": 2},
    {"step": 4, "instruction": "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper", "duration_minutes": 2},
    {"step": 5, "instruction": "Pour dressing over salad and toss gently to combine", "duration_minutes": 2},
    {"step": 6, "instruction": "Serve immediately or chill for 30 minutes for better flavor", "duration_minutes": 2}
  ]',
  ARRAY['large bowl', 'small bowl', 'whisk'],
  ARRAY['gluten-free', 'high-protein', 'mediterranean'],
  ARRAY['dairy'],
  'mild',
  TRUE,
  TRUE,
  TRUE,
  FALSE
),

-- Dinner Recipes
(
  '550e8400-e29b-41d4-a716-446655440004',
  NULL,
  'Spaghetti Carbonara',
  'Classic Italian pasta dish with eggs, cheese, and pancetta',
  'Italian',
  ARRAY['dinner'],
  'medium',
  10,
  15,
  4,
  580,
  28.5,
  52.8,
  28.9,
  2.1,
  2.5,
  950,
  '[
    {"name": "Spaghetti", "amount": 1, "unit": "pound", "notes": "Good quality pasta"},
    {"name": "Pancetta", "amount": 4, "unit": "ounces", "notes": "Diced, can substitute with bacon"},
    {"name": "Large eggs", "amount": 3, "unit": "pieces", "notes": "Room temperature"},
    {"name": "Egg yolks", "amount": 2, "unit": "pieces", "notes": "Room temperature"},
    {"name": "Pecorino Romano cheese", "amount": 1, "unit": "cup", "notes": "Freshly grated"},
    {"name": "Black pepper", "amount": 1, "unit": "teaspoon", "notes": "Freshly ground, coarse"},
    {"name": "Salt", "amount": 1, "unit": "teaspoon", "notes": "For pasta water"}
  ]',
  '[
    {"step": 1, "instruction": "Bring a large pot of salted water to boil for pasta", "duration_minutes": 5},
    {"step": 2, "instruction": "In a large pan, cook pancetta over medium heat until crispy", "duration_minutes": 5},
    {"step": 3, "instruction": "In a bowl, whisk together eggs, egg yolks, grated cheese, and black pepper", "duration_minutes": 3},
    {"step": 4, "instruction": "Cook spaghetti according to package directions until al dente", "duration_minutes": 8},
    {"step": 5, "instruction": "Reserve 1 cup of pasta cooking water, then drain pasta", "duration_minutes": 1},
    {"step": 6, "instruction": "Add hot pasta to pan with pancetta, remove from heat", "duration_minutes": 1},
    {"step": 7, "instruction": "Quickly add egg mixture, tossing constantly to create creamy sauce", "duration_minutes": 2},
    {"step": 8, "instruction": "Add pasta water gradually if needed to achieve creamy consistency", "duration_minutes": 1},
    {"step": 9, "instruction": "Serve immediately with extra cheese and pepper", "duration_minutes": 1}
  ]',
  ARRAY['large pot', 'large pan', 'whisk', 'bowl', 'tongs'],
  ARRAY['italian', 'comfort-food'],
  ARRAY['eggs', 'dairy', 'gluten'],
  'mild',
  TRUE,
  TRUE,
  TRUE,
  FALSE
),

-- Snack Recipe
(
  '550e8400-e29b-41d4-a716-446655440005',
  NULL,
  'Avocado Toast with Everything Seasoning',
  'Simple and nutritious avocado toast topped with everything bagel seasoning',
  'American',
  ARRAY['breakfast', 'snack'],
  'easy',
  5,
  2,
  1,
  320,
  8.5,
  28.2,
  20.8,
  12.5,
  2.1,
  420,
  '[
    {"name": "Whole grain bread", "amount": 2, "unit": "slices", "notes": "Good quality, thick slices"},
    {"name": "Ripe avocado", "amount": 1, "unit": "large", "notes": "Should yield easily to gentle pressure"},
    {"name": "Lemon juice", "amount": 1, "unit": "teaspoon", "notes": "Fresh squeezed"},
    {"name": "Everything bagel seasoning", "amount": 1, "unit": "teaspoon", "notes": "Store-bought or homemade"},
    {"name": "Salt", "amount": 0.125, "unit": "teaspoon", "notes": "Flaky sea salt preferred"},
    {"name": "Red pepper flakes", "amount": 0.125, "unit": "teaspoon", "notes": "Optional, to taste"}
  ]',
  '[
    {"step": 1, "instruction": "Toast bread slices until golden brown and crispy", "duration_minutes": 2},
    {"step": 2, "instruction": "Cut avocado in half, remove pit, and scoop flesh into a bowl", "duration_minutes": 1},
    {"step": 3, "instruction": "Mash avocado with lemon juice and salt until desired consistency", "duration_minutes": 1},
    {"step": 4, "instruction": "Spread mashed avocado evenly on toast slices", "duration_minutes": 1},
    {"step": 5, "instruction": "Sprinkle everything bagel seasoning and red pepper flakes on top", "duration_minutes": 1},
    {"step": 6, "instruction": "Serve immediately while toast is still warm", "duration_minutes": 1}
  ]',
  ARRAY['toaster', 'bowl', 'fork'],
  ARRAY['vegetarian', 'healthy', 'high-fiber'],
  ARRAY['gluten'],
  'mild',
  TRUE,
  TRUE,
  TRUE,
  FALSE
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample dietary tags and cuisine types for reference
INSERT INTO public.recipe_tags (recipe_id, tag_name, tag_category) VALUES
-- Scrambled Eggs tags
('550e8400-e29b-41d4-a716-446655440001', 'quick', 'time'),
('550e8400-e29b-41d4-a716-446655440001', 'protein-rich', 'nutrition'),
('550e8400-e29b-41d4-a716-446655440001', 'breakfast', 'meal'),

-- Overnight Oats tags
('550e8400-e29b-41d4-a716-446655440002', 'make-ahead', 'preparation'),
('550e8400-e29b-41d4-a716-446655440002', 'no-cook', 'preparation'),
('550e8400-e29b-41d4-a716-446655440002', 'healthy', 'nutrition'),

-- Mediterranean Chicken Salad tags
('550e8400-e29b-41d4-a716-446655440003', 'low-carb', 'diet'),
('550e8400-e29b-41d4-a716-446655440003', 'protein-rich', 'nutrition'),
('550e8400-e29b-41d4-a716-446655440003', 'fresh', 'preparation'),

-- Spaghetti Carbonara tags
('550e8400-e29b-41d4-a716-446655440004', 'comfort-food', 'style'),
('550e8400-e29b-41d4-a716-446655440004', 'traditional', 'style'),
('550e8400-e29b-41d4-a716-446655440004', 'pasta', 'ingredient'),

-- Avocado Toast tags
('550e8400-e29b-41d4-a716-446655440005', 'quick', 'time'),
('550e8400-e29b-41d4-a716-446655440005', 'healthy-fats', 'nutrition'),
('550e8400-e29b-41d4-a716-446655440005', 'trendy', 'style')
ON CONFLICT (recipe_id, tag_name) DO NOTHING;

-- Update recipe statistics to simulate real usage
UPDATE public.recipes SET
  save_count = FLOOR(RANDOM() * 100 + 10),
  average_rating = ROUND((RANDOM() * 2 + 3)::NUMERIC, 1),
  rating_count = FLOOR(RANDOM() * 50 + 5)
WHERE is_curated = TRUE;

-- Comments
COMMENT ON TABLE public.recipes IS 'This table now contains curated seed recipes for fallback content';
COMMENT ON TABLE public.recipe_tags IS 'This table now contains sample tags for the curated recipes';