require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedQuiz() {
  try {
    const existingQuiz = await prisma.quiz.findFirst();
    if (existingQuiz) {
      console.log('Quiz already exists. Skipping seed.');
      await prisma.$disconnect();
      process.exit(0);
    }

    await prisma.quiz.create({
      data: {
        titleEn: 'Find Your Perfect Product',
        titleNe: 'आपको लागि परफेक्ट उत्पाद खोज्नुहोस्',
        descriptionEn: 'Answer a few questions to get personalized product recommendations',
        descriptionNe: 'केहि प्रश्नको जवाफ दिएर व्यक्तिगत उत्पाद सुझाव पाउनुहोस्',
        isActive: true,
        questions: {
          create: [
            {
              order: 1,
              textEn: 'What is your budget?',
              textNe: 'तपाइंको बजेट कति हो?',
              type: 'single_select',
              category: 'budget',
              options: {
                create: [
                  { labelEn: 'Under Rs. 5000', labelNe: 'Rs. 5000 भन्दा कम', value: 'budget_low', tags: ['budget-friendly', 'entry-level'], weight: 1 },
                  { labelEn: 'Rs. 5000 - Rs. 15000', labelNe: 'Rs. 5000 - Rs. 15000', value: 'budget_mid', tags: ['mid-range', 'popular'], weight: 1 },
                  { labelEn: 'Rs. 15000 - Rs. 30000', labelNe: 'Rs. 15000 - Rs. 30000', value: 'budget_high', tags: ['premium', 'quality'], weight: 1 },
                  { labelEn: 'Over Rs. 30000', labelNe: 'Rs. 30000 भन्दा माथि', value: 'budget_luxury', tags: ['luxury', 'high-end'], weight: 1 },
                ],
              },
            },
            {
              order: 2,
              textEn: 'What is your experience level?',
              textNe: 'तपाइंको अनुभव स्तर कस्तो हो?',
              type: 'single_select',
              category: 'experience',
              options: {
                create: [
                  { labelEn: 'Beginner', labelNe: 'शुरुवाती', value: 'experience_beginner', tags: ['beginner-friendly', 'easy-to-use'], weight: 1 },
                  { labelEn: 'Intermediate', labelNe: 'मध्यम', value: 'experience_intermediate', tags: ['intermediate', 'versatile'], weight: 1 },
                  { labelEn: 'Advanced', labelNe: 'उन्नत', value: 'experience_advanced', tags: ['advanced-features', 'professional'], weight: 1 },
                ],
              },
            },
            {
              order: 3,
              textEn: 'What are your main preferences? (Select all that apply)',
              textNe: 'तपाइंको मुख्य पसंद के हो? (सबै लागु हुने छान्नुहोस्)',
              type: 'multi_select',
              category: 'preference',
              options: {
                create: [
                  { labelEn: 'Discreet/Quiet', labelNe: 'गोप्य/शांत', value: 'pref_quiet', tags: ['quiet', 'discreet', 'silent'], weight: 1 },
                  { labelEn: 'Powerful', labelNe: 'शक्तिशाली', value: 'pref_powerful', tags: ['powerful', 'strong', 'intensity'], weight: 1 },
                  { labelEn: 'Long Battery Life', labelNe: 'लामो ब्याटरी जीवन', value: 'pref_battery', tags: ['long-battery', 'endurance'], weight: 1 },
                  { labelEn: 'Waterproof', labelNe: 'जलरोधी', value: 'pref_waterproof', tags: ['waterproof', 'submersible'], weight: 1 },
                  { labelEn: 'Luxury Design', labelNe: 'लक्जरी डिजाइन', value: 'pref_design', tags: ['premium-design', 'luxury-finish'], weight: 1 },
                  { labelEn: 'Wireless Charging', labelNe: 'वायरलेस चार्जिङ', value: 'pref_wireless', tags: ['wireless-charging', 'convenient'], weight: 1 },
                ],
              },
            },
            {
              order: 4,
              textEn: 'What material/finish do you prefer?',
              textNe: 'तपाइं कुन सामग्री/समाप्ति पसंद गर्नुहुन्छ?',
              type: 'single_select',
              category: 'specific-need',
              options: {
                create: [
                  { labelEn: 'Silicone', labelNe: 'सिलिकन', value: 'material_silicone', tags: ['silicone'], weight: 1 },
                  { labelEn: 'Glass', labelNe: 'गिलास', value: 'material_glass', tags: ['glass'], weight: 1 },
                  { labelEn: 'Stainless Steel', labelNe: 'स्टेनलेस स्टील', value: 'material_steel', tags: ['stainless-steel', 'metal'], weight: 1 },
                  { labelEn: 'Mixed Materials', labelNe: 'मिश्रित सामग्री', value: 'material_mixed', tags: ['mixed-materials'], weight: 1 },
                  { labelEn: 'No preference', labelNe: 'कोई पसंद नहीं', value: 'material_none', tags: ['any-material'], weight: 0.5 },
                ],
              },
            },
          ],
        },
      },
    });

    console.log('✅ Quiz seeded successfully');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding quiz:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedQuiz();
