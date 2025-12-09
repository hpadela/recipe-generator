# Recipe Remix

I am building a web application intended to help users create recipes from ingredients they have on hand. The name of the application is MouseChef AI.

## Initial Instructions
	- I will be providing you with an initial prompt outlining my intended design. 
	- Read this prompt and await further instructions. 
	- Do not begin coding. 
	- I want you to play the role of expert full-stack developer
Important: Upon reading this prompt confirm your understanding of the task. 

## Basic Functionality

The basic functionality of the application is that there is an initial web form where the user can:

1. Upload a photo of ingredients they have available
2. Specify dietary restrictions (include option for something esle)
3. Choose a preferred cuisine style (include option for something else)
4. Select their cooking skill level (beginner/ intermediate/ advanced)
5. Indicate available cooking time (15 min / 30 min / 45 min / 60 min)
6. Optionally request a styled recipe card image

The application will:

1. Analyze the uploaded photo to identify ingredients
2. Display the identified ingredients for user confirmation/editing
3. Generate a complete recipe based on the ingredients and preferences
4. Generate a styled recipe card image (if requested)

The final recipe and image will be displayed in a clean, printable format. 

## Clarifications

- **Multi-image upload**: Users can upload multiple images at once
- **Dietary restrictions**: Multi-select (can combine e.g., Vegetarian + Gluten-Free)
- **Ingredient editing**: Users can edit both name and quantity of detected ingredients, plus add/remove
- **Recipe regeneration**: Users can regenerate recipe without starting over
- **Image storage**: Recipe card images displayed ephemerally (not persisted), recipe downloadable
- **Authentication**: Single-session app (no auth), but architecture should allow future persistence
- **Loading screen**: Show progress during AI processing (no skip/demo link in production)
- **Print**: Browser print dialog

## Tech Stack

- Next.js
- Tailwind CSS
- Vercel
- Vercel Serverless Functions

## LLM Provider

**OpenAI (GPT-4o)**

- API Key: Managed via environment variables
- Image Analysis: GPT-4o
- Text Generation: GPT-4o
- Image Generation: gpt-image-1

## API Call Sequence
  1. ANALYZE INGREDIENTS        
     Input: Photo of ingredients (can be multiple photos)                                
     Output: Structured list of identified ingredients

  User review/edits ingredients

  2. GENERATE RECIPE                              
     Input: Ingredients + dietary + cuisine + skill + time   
     Output: Complete structured recipe with image prompt

  3. GENERATE IMAGE (conditional - if user wants image)         
     Input: Recipe details + image prompt + style                
     Output: Styled recipe card image    


## Visual Identity 

Brand Essence
Tagline: Transform what you have into something delicious.
Brand Personality:

Warm & Welcoming — like a friend who's great at cooking
Confident but not intimidating — accessible to all skill levels
Fresh & Modern — clean design with personality
Playful but trustworthy — fun without being silly

Mood: Sunday morning kitchen. Natural light streaming in. Coffee brewing. The satisfying feeling of making something from scratch with what you have on hand.

Color Palette
Primary Colors
NameHexUsageSizzle Orange#E85D04Primary CTAs, active states, key highlightsWarm Brown#3D2314Primary text, headers
Secondary Colors
NameHexUsageCream#FFF8F0Page backgroundSoft Sage#A8B5A0Success states, fresh/veggie accentsButter Yellow#F9DC5CHighlights, tips, warmth accentsTerracotta#C65D3BSecondary buttons, hover states
Neutral Colors
NameHexUsageWhite#FFFFFFCards, containersWarm Gray#8B7355Secondary text, iconsLight Tan#F5EBE0Borders, dividers, subtle backgroundsAmber Mist#FEF3E2Hover states, selected backgrounds
Semantic Colors
NameHexUsageSuccess Green#5A9A6ECompleted steps, confirmationsError Red#D64545Errors, required fieldsInfo Blue#5B8FB9Informational messages
Gradient
Primary Gradient:
cssbackground: linear-gradient(135deg, #E85D04 0%, #F9DC5C 100%);
Use for: Primary CTA buttons, hero accents, loading states

Typography
Font Stack
Primary (UI & Body): Inter or DM Sans

Clean, modern, highly readable
Weights: 400 (body), 500 (medium), 600 (semibold), 700 (bold)

Secondary (Display & Titles): Fraunces or Playfair Display

Elegant serif with personality
Use for recipe titles, hero text, section headers
Weights: 600, 700

Fallback Stack:
cssfont-family: 'Inter', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-family: 'Fraunces', 'Playfair Display', Georgia, serif;
Type Scale
ElementSizeWeightFontLine HeightHero Title36px / 2.25rem700Serif1.2Page Title28px / 1.75rem700Serif1.3Section Header20px / 1.25rem600Sans1.4Card Title18px / 1.125rem600Sans1.4Body16px / 1rem400Sans1.6Body Small14px / 0.875rem400Sans1.5Caption12px / 0.75rem500Sans1.4Button14px / 0.875rem600Sans1
Text Colors

Primary text: #3D2314 (Warm Brown)
Secondary text: #8B7355 (Warm Gray)
Muted text: #A89585
Inverse (on dark/orange): #FFFFFF


Spacing System
Based on 4px grid:
TokenValueUsagexs4pxTight spacing, icon gapssm8pxCompact elementsmd16pxStandard paddinglg24pxSection spacingxl32pxLarge gaps2xl48pxPage sections3xl64pxMajor divisions

Border Radius
TokenValueUsagesm8pxSmall buttons, tags, inputsmd12pxCards, medium buttonslg16pxLarge cards, modalsxl24pxHero elements, CTAsfull9999pxPills, avatars, circular buttons

Shadows
Card Shadow (default):
cssbox-shadow: 0 4px 12px rgba(61, 35, 20, 0.08);
Card Shadow (hover):
cssbox-shadow: 0 8px 24px rgba(61, 35, 20, 0.12);
Button Shadow:
cssbox-shadow: 0 4px 14px rgba(232, 93, 4, 0.3);
Inset/Pressed:
cssbox-shadow: inset 0 2px 4px rgba(61, 35, 20, 0.1);

Components
Buttons
Primary Button:

Background: linear-gradient(135deg, #E85D04 0%, #F9DC5C 100%)
Text: White, 14px, semibold
Padding: 12px 24px
Border Radius: 16px
Shadow: Button shadow
Hover: Slight lift, increased shadow

Secondary Button:

Background: #FEF3E2
Border: 1px solid #F5EBE0
Text: #3D2314, 14px, semibold
Hover: Background #F5EBE0

Ghost Button:

Background: Transparent
Text: #E85D04, 14px, semibold
Hover: Background #FEF3E2

Selection Pills (single select)
Default:

Background: #FEF3E2
Text: #3D2314
Border Radius: 12px
Padding: 12px 16px

Selected:

Background: #E85D04
Text: White
Shadow: Subtle lift

Multi-Select Tags
Default:

Background: #FEF3E2
Text: #3D2314
Border Radius: 9999px (pill)
Padding: 8px 16px

Selected:

Background: #E85D04
Text: White
Checkmark icon appears

Input Fields

Background: White
Border: 1px solid #F5EBE0
Border Radius: 12px
Padding: 12px 16px
Focus: Border #E85D04, subtle orange glow

Cards

Background: White
Border: 1px solid #F5EBE0
Border Radius: 16px
Padding: 20px - 24px
Shadow: Card shadow


Iconography
Style: Rounded, friendly, consistent stroke weight
Recommended Library: Lucide React or Phosphor Icons
Icon Sizes:

Small: 16px (inline, buttons)
Medium: 20px (list items, labels)
Large: 24px (section headers)
XL: 32px+ (empty states, features)

Icon Colors:

Default: #8B7355
Active/Selected: #E85D04
On dark background: White

Food-Related Emoji: Use sparingly for warmth and personality

Approved: 🍳 🔪 🔥 🍽️ 📊 ⚡ 🕐 🍝 🌮 🍜 🫒 🍔 🍛 💡
Use in: Category labels, time indicators, cuisine selectors


Imagery
Photography Style
Hero/Generated Images:

Warm, natural lighting (side-lit, morning light feel)
Shallow depth of field
Appetizing, not overly styled
Authentic, homemade aesthetic
Warm color temperature

Color Treatment:

Slightly warm white balance
Rich, saturated food colors
Soft shadows, not harsh

Illustration Style (if used)

Simple, friendly line work
Warm color palette from brand colors
Hand-drawn feel, not overly polished
Consistent stroke weight


Motion & Animation
Principles

Purposeful: Animation should guide attention or provide feedback
Subtle: Never distracting or excessive
Warm: Ease-out curves feel natural and inviting

Timing
TypeDurationEasingMicro (hover, focus)150msease-outSmall (buttons, toggles)200msease-outMedium (cards, panels)300msease-outLarge (page transitions)400msease-in-out
Common Animations
Hover Lift:
csstransform: translateY(-2px);
transition: transform 200ms ease-out, box-shadow 200ms ease-out;
Button Press:
csstransform: scale(0.98);
transition: transform 100ms ease-out;
Fade In:
cssopacity: 0 → 1;
transform: translateY(8px) → translateY(0);
transition: 300ms ease-out;
Loading Pulse:
cssanimation: pulse 1.5s ease-in-out infinite;

Do's and Don'ts
Do ✓

Use warm, inviting colors
Keep plenty of white space
Use rounded corners consistently
Let food imagery be the hero
Use emoji sparingly for personality
Maintain high contrast for readability
Use the serif font for recipe titles

Don't ✗

Use harsh, cold colors (pure blue, stark white)
Crowd the interface with too many elements
Mix rounded and sharp corners
Use low-quality or stock-looking food photos
Overuse emoji (keep it tasteful)
Sacrifice readability for aesthetics
Use the serif font for small body text


Sample CSS Variables
css:root {
  /* Colors */
  --color-primary: #E85D04;
  --color-primary-dark: #C65D3B;
  --color-text: #3D2314;
  --color-text-secondary: #8B7355;
  --color-background: #FFF8F0;
  --color-surface: #FFFFFF;
  --color-border: #F5EBE0;
  --color-accent: #F9DC5C;
  --color-success: #5A9A6E;
  --color-error: #D64545;
  
  /* Typography */
  --font-sans: 'Inter', 'DM Sans', -apple-system, sans-serif;
  --font-serif: 'Fraunces', 'Playfair Display', Georgia, serif;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-card: 0 4px 12px rgba(61, 35, 20, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(61, 35, 20, 0.12);
  --shadow-button: 0 4px 14px rgba(232, 93, 4, 0.3);
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;
}

Tailwind Config (if using Tailwind CSS)
javascriptmodule.exports = {
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#E85D04',
          600: '#C65D3B',
        },
        amber: {
          50: '#FEF3E2',
          100: '#F5EBE0',
          400: '#F9DC5C',
          700: '#8B7355',
          800: '#3D2314',
          900: '#3D2314',
        },
        cream: '#FFF8F0',
        sage: '#A8B5A0',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(61, 35, 20, 0.08)',
        'card-hover': '0 8px 24px rgba(61, 35, 20, 0.12)',
        'button': '0 4px 14px rgba(232, 93, 4, 0.3)',
      },
    },
  },
}

Quick Reference
When in doubt:

Background: #FFF8F0 (Cream)
Cards: #FFFFFF with #F5EBE0 border
Primary action: #E85D04 (Sizzle Orange)
Text: #3D2314 (Warm Brown)
Corners: 16px for cards, 12px for buttons
Font: Inter for UI, Fraunces for titles

## LLM Integration Details

### Input Format: Ingredient Analysis

```json
{
  "images" : [
    "data:image/jped;base64,/9j/4a",
    "data:iamge/jpeg;base64,/9j/4c",
  ]
}
```

### Expected Output: Ingredient Analysis

```json
{
  "ingredients": [
    {
      "name": "eggs",
      "quantity": "4 large",
      "category": "protein"
    },
    {
      "name": "cherry tomatoes",
      "quantity": "~1 cup",
      "category": "vegetable"
    },
    {
      "name": "parmesan cheese",
      "quantity": "~100g block",
      "category": "dairy"
    },
    {
      "name": "fresh basil",
      "quantity": "1 bunch",
      "category": "spice"
    },
    {
      "name": "olive oil",
      "quantity": "bottle visible",
      "category": "condiment"
    }
  ],
  "notes": "All ingredients appear fresh. The parmesan looks to be a wedge that could be grated."
}
```

---

### Input Format: Recipe Generation

```json
{
  "variables": {
    "ingredients": "[{\"name\": \"eggs\", \"quantity\": \"4 large\"}, {\"name\": \"cherry tomatoes\", \"quantity\": \"1 cup\"}, {\"name\": \"parmesan cheese\", \"quantity\": \"100g\"}, {\"name\": \"fresh basil\", \"quantity\": \"1 bunch\"}, {\"name\": \"olive oil\", \"quantity\": \"available\"}]",
    "dietary_restrictions": "Vegetarian",
    "cuisine_style": "Italian",
    "skill_level": "Intermediate",
    "max_cooking_time": "30"
  }
}
```

### Expected Output: Recipe Generation

```json
{
  "title": "Tuscan Baked Eggs with Tomatoes and Parmesan",
  "description": "A rustic Italian breakfast or light dinner featuring eggs baked in a bed of blistered cherry tomatoes, topped with shaved parmesan and fresh basil. Simple, elegant, and ready in under 30 minutes.",
  "prepTime": "10 minutes",
  "cookTime": "18 minutes",
  "totalTime": "28 minutes",
  "servings": "2 servings",
  "difficulty": "Medium",
  "tags": ["Vegetarian", "One-Pan", "Italian", "Brunch"],
  "ingredients": [
    {
      "item": "cherry tomatoes",
      "amount": "1 cup",
      "preparation": "halved"
    },
    {
      "item": "eggs",
      "amount": "4 large",
      "preparation": ""
    },
    {
      "item": "parmesan cheese",
      "amount": "50g",
      "preparation": "shaved, plus extra for serving"
    },
    {
      "item": "fresh basil",
      "amount": "8-10 leaves",
      "preparation": "torn"
    },
    {
      "item": "olive oil",
      "amount": "2 tablespoons",
      "preparation": ""
    },
    {
      "item": "salt and pepper",
      "amount": "to taste",
      "preparation": ""
    }
  ],
  "instructions": [
    {
      "step": 1,
      "text": "Preheat your oven to 400°F (200°C). Place an oven-safe skillet or baking dish in the oven while it preheats.",
      "tip": "A cast iron skillet works beautifully here and helps create crispy edges on the tomatoes."
    },
    {
      "step": 2,
      "text": "Carefully remove the hot skillet. Add olive oil and swirl to coat. Add the halved cherry tomatoes in a single layer, cut-side down.",
      "tip": ""
    },
    {
      "step": 3,
      "text": "Return to oven and roast for 8-10 minutes until tomatoes are softened and starting to blister.",
      "tip": ""
    },
    {
      "step": 4,
      "text": "Remove skillet and create 4 small wells in the tomatoes. Crack one egg into each well. Season with salt and pepper.",
      "tip": "Crack eggs into a small bowl first to avoid shell pieces and ensure clean placement."
    },
    {
      "step": 5,
      "text": "Scatter half the parmesan shavings over the top. Return to oven and bake for 6-8 minutes until egg whites are set but yolks remain runny.",
      "tip": "For firmer yolks, add 2-3 minutes. Watch carefully as they set quickly at the end."
    },
    {
      "step": 6,
      "text": "Remove from oven, top with remaining parmesan and torn fresh basil. Drizzle with a little extra olive oil and serve immediately.",
      "tip": ""
    }
  ],
  "featuredImagePrompt": "Overhead shot of a rustic cast iron skillet containing Tuscan baked eggs — four eggs with golden runny yolks nestled in blistered cherry tomatoes, scattered with shaved parmesan and fresh green basil leaves. Drizzle of golden olive oil catching the light. Warm morning light from the side. Rustic wooden table surface, linen napkin in corner, crusty bread slice partially visible. Steam rising gently. Appetizing, Mediterranean, fresh and inviting.",
  "nutritionEstimate": {
    "calories": "~320 per serving",
    "protein": "18g",
    "carbs": "6g",
    "fat": "25g"
  }
}
```

---

### Input Format: Image Generation

'featuredImagePrompt' from the recipe generation reponse.
'title' from the recipe generation response
The styled recipe card image option chosen by the user


### Output Format: Image Generation

PNG file URL returned from gpt-image-1

---

## Next Step
	- Remember your next step is to review these instructions and confirm your understanding.
  - I will be supplying more instructions later.


