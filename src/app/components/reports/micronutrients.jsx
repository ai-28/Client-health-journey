"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { TrendingUp, AlertCircle, Search, TrendingDown, AlertTriangle, CheckCircle, Apple, Beef, Carrot, Lightbulb, Target, Heart, Brain, Zap } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CircularProgress } from '../CircularProgress';
import { Clock } from 'lucide-react';

const getNutrientIcon = (nutrientName) => {
  const name = nutrientName.toLowerCase();
  if (name.includes('vitamin c') || name.includes('folate')) return <Apple className="w-4 h-4" />;
  if (name.includes('iron') || name.includes('protein')) return <Beef className="w-4 h-4" />;
  if (name.includes('vitamin a') || name.includes('beta')) return <Carrot className="w-4 h-4" />;
  if (name.includes('vitamin e')) return <Lightbulb className="w-4 h-4" />;
  if (name.includes('vitamin k')) return <Heart className="w-4 h-4" />;
  if (name.includes('vitamin b1') || name.includes('thiamin')) return <Zap className="w-4 h-4" />;
  if (name.includes('vitamin b2') || name.includes('riboflavin')) return <Lightbulb className="w-4 h-4" />;
  if (name.includes('vitamin b3') || name.includes('niacin')) return <Brain className="w-4 h-4" />;
  if (name.includes('vitamin b6')) return <Brain className="w-4 h-4" />;
  if (name.includes('vitamin b12')) return <Brain className="w-4 h-4" />;
  if (name.includes('phosphorus')) return <Heart className="w-4 h-4" />;
  if (name.includes('selenium')) return <Target className="w-4 h-4" />;
  if (name.includes('sodium')) return <AlertTriangle className="w-4 h-4" />;
  return <CheckCircle className="w-4 h-4" />;
};

const getDetailedRecommendations = (nutrientName, percentOfTarget) => {
  const name = nutrientName.toLowerCase();
  const deficit = Math.max(0, 100 - percentOfTarget);
  
  const recommendations = {
    foods: [],
    tips: [],
    timing: '',
    combinations: [],
    // Enhanced health information
    bodyFunction: '',
    healthBenefits: [],
    deficiencySymptoms: [],
    riskFactors: [],
    icon: <CheckCircle className="w-4 h-4" />,
    systemsAffected: [],
    category: ''
  };

  if (name.includes('vitamin c')) {
    recommendations.foods = ['Citrus fruits (oranges, lemons)', 'Bell peppers (red, yellow)', 'Strawberries', 'Kiwi fruit', 'Broccoli'];
    recommendations.tips = ['Cook vegetables lightly to preserve vitamin C', 'Eat vitamin C foods with iron-rich foods for better absorption'];
    recommendations.timing = 'Best absorbed when spread throughout the day';
    recommendations.combinations = ['Pair with iron-rich foods like spinach', 'Combine with vitamin E for enhanced antioxidant effect'];
    recommendations.bodyFunction = 'Essential for collagen synthesis, immune function, and iron absorption. Acts as a powerful antioxidant protecting cells from damage.';
    recommendations.healthBenefits = ['Boosts immune system', 'Promotes wound healing', 'Enhances iron absorption', 'Protects against oxidative stress'];
    recommendations.deficiencySymptoms = ['Frequent colds and infections', 'Slow wound healing', 'Fatigue and weakness', 'Joint and muscle aches', 'Easy bruising', 'Dry, splitting hair'];
    recommendations.riskFactors = ['Smokers need 35mg more daily', 'Stress increases vitamin C needs', 'Limited fresh produce intake'];
    recommendations.icon = <Apple className="w-4 h-4 text-orange-500" />;
    recommendations.systemsAffected = ['Immune system', 'Connective tissue', 'Cardiovascular system'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin a')) {
    recommendations.foods = ['Sweet potatoes', 'Carrots', 'Dark leafy greens', 'Liver', 'Eggs'];
    recommendations.tips = ['Cook with a small amount of fat for better absorption', 'Beta-carotene converts to vitamin A in your body'];
    recommendations.timing = 'Fat-soluble vitamin - take with meals containing fat';
    recommendations.combinations = ['Pair with healthy fats like avocado or olive oil', 'Combine with zinc for optimal absorption'];
    recommendations.bodyFunction = 'Critical for vision, immune function, cell growth, and reproduction. Maintains healthy skin and mucous membranes.';
    recommendations.healthBenefits = ['Supports night vision', 'Maintains healthy skin', 'Boosts immune function', 'Promotes cell growth and development'];
    recommendations.deficiencySymptoms = ['Night blindness or poor vision in dim light', 'Dry, rough skin', 'Frequent infections', 'Delayed wound healing', 'Dry eyes'];
    recommendations.riskFactors = ['Low fat diet reduces absorption', 'Digestive disorders', 'Alcohol abuse'];
    recommendations.icon = <Carrot className="w-4 h-4 text-orange-500" />;
    recommendations.systemsAffected = ['Visual system', 'Immune system', 'Skin and mucous membranes'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin d')) {
    recommendations.foods = ['Fatty fish (salmon, mackerel)', 'Fortified dairy products', 'Egg yolks', 'Mushrooms (UV-exposed)'];
    recommendations.tips = ['Get 10-15 minutes of sunlight daily', 'Consider supplementation if deficient'];
    recommendations.timing = 'Take with the largest meal of the day for best absorption';
    recommendations.combinations = ['Take with calcium and magnesium', 'Pair with vitamin K2 for bone health'];
    recommendations.bodyFunction = 'Regulates calcium and phosphorus absorption, supports immune function, and maintains bone health. Acts as a hormone in the body.';
    recommendations.healthBenefits = ['Strengthens bones and teeth', 'Supports immune function', 'Regulates mood', 'Reduces inflammation'];
    recommendations.deficiencySymptoms = ['Bone pain and tenderness', 'Muscle weakness and aches', 'Fatigue and depression', 'Frequent illness', 'Hair loss'];
    recommendations.riskFactors = ['Limited sun exposure', 'Dark skin in northern climates', 'Older adults', 'Indoor lifestyle'];
    recommendations.icon = <Heart className="w-4 h-4 text-yellow-500" />;
    recommendations.systemsAffected = ['Skeletal system', 'Immune system', 'Muscular system'];
    recommendations.category = 'vitamins';
  } else if (name.includes('iron')) {
    recommendations.foods = ['Red meat', 'Spinach and dark leafy greens', 'Lentils and beans', 'Tofu', 'Pumpkin seeds'];
    recommendations.tips = ['Avoid tea/coffee with iron-rich meals', 'Cast iron cooking can increase iron content'];
    recommendations.timing = 'Best absorbed on empty stomach, but take with food if it causes stomach upset';
    recommendations.combinations = ['Pair with vitamin C foods for 3x better absorption', 'Avoid with calcium supplements'];
    recommendations.bodyFunction = 'Essential component of hemoglobin for oxygen transport. Critical for energy production and immune function.';
    recommendations.healthBenefits = ['Prevents anemia', 'Boosts energy levels', 'Supports cognitive function', 'Strengthens immune system'];
    recommendations.deficiencySymptoms = ['Fatigue and weakness', 'Pale skin, nails, or inner eyelids', 'Shortness of breath', 'Cold hands and feet', 'Restless leg syndrome', 'Cravings for ice or starch'];
    recommendations.riskFactors = ['Heavy menstrual periods', 'Vegetarian/vegan diet', 'Frequent blood donation', 'Digestive disorders'];
    recommendations.icon = <Beef className="w-4 h-4 text-red-500" />;
    recommendations.systemsAffected = ['Circulatory system', 'Energy metabolism', 'Cognitive function'];
    recommendations.category = 'minerals';
  } else if (name.includes('calcium')) {
    recommendations.foods = ['Dairy products', 'Fortified plant milks', 'Sardines with bones', 'Tahini', 'Kale'];
    recommendations.tips = ['Spread intake throughout the day (max 500mg at once)', 'Weight-bearing exercise helps absorption'];
    recommendations.timing = 'Take smaller doses throughout the day for optimal absorption';
    recommendations.combinations = ['Take with vitamin D and magnesium', 'Separate from iron supplements by 2 hours'];
    recommendations.bodyFunction = 'Primary mineral for bone and teeth structure. Essential for muscle contractions, nerve signaling, and blood clotting.';
    recommendations.healthBenefits = ['Builds strong bones and teeth', 'Supports muscle function', 'Enables proper nerve transmission', 'Aids blood clotting'];
    recommendations.deficiencySymptoms = ['Muscle cramps and spasms', 'Numbness and tingling in fingers', 'Brittle or weak nails', 'Dental problems', 'Bone pain'];
    recommendations.riskFactors = ['Lactose intolerance', 'Post-menopause', 'Limited dairy intake', 'Vitamin D deficiency'];
    recommendations.icon = <Heart className="w-4 h-4 text-blue-500" />;
    recommendations.systemsAffected = ['Skeletal system', 'Muscular system', 'Nervous system'];
    recommendations.category = 'minerals';
  } else if (name.includes('magnesium')) {
    recommendations.foods = ['Nuts and seeds', 'Whole grains', 'Dark chocolate', 'Avocados', 'Spinach'];
    recommendations.tips = ['Stress and alcohol can deplete magnesium', 'Epsom salt baths can provide topical magnesium'];
    recommendations.timing = 'Take with dinner or before bed for relaxation benefits';
    recommendations.combinations = ['Works synergistically with calcium and vitamin D', 'Take with B vitamins for energy metabolism'];
    recommendations.bodyFunction = 'Cofactor in over 300 enzymatic reactions. Critical for energy production, protein synthesis, and muscle/nerve function.';
    recommendations.healthBenefits = ['Supports muscle and nerve function', 'Regulates blood sugar', 'Promotes better sleep', 'Reduces stress and anxiety'];
    recommendations.deficiencySymptoms = ['Muscle cramps and twitches', 'Fatigue and weakness', 'Anxiety and irritability', 'Irregular heartbeat', 'Difficulty sleeping', 'Headaches'];
    recommendations.riskFactors = ['High stress levels', 'Excessive alcohol consumption', 'Diabetes', 'Digestive disorders'];
    recommendations.icon = <Zap className="w-4 h-4 text-green-500" />;
    recommendations.systemsAffected = ['Muscular system', 'Nervous system', 'Energy metabolism'];
    recommendations.category = 'minerals';
  } else if (name.includes('potassium')) {
    recommendations.foods = ['Bananas', 'Potatoes with skin', 'White beans', 'Spinach', 'Coconut water'];
    recommendations.tips = ['Cook vegetables in minimal water to preserve potassium', 'Most people need more potassium than sodium'];
    recommendations.timing = 'Spread throughout the day to support steady blood pressure';
    recommendations.combinations = ['Balance with sodium intake', 'Works with magnesium for heart health'];
    recommendations.bodyFunction = 'Essential electrolyte for fluid balance, muscle contractions, and nerve signals. Critical for heart rhythm and blood pressure regulation.';
    recommendations.healthBenefits = ['Regulates blood pressure', 'Supports heart function', 'Prevents muscle cramps', 'Maintains fluid balance'];
    recommendations.deficiencySymptoms = ['Muscle weakness and cramps', 'Fatigue and lethargy', 'Irregular heartbeat', 'High blood pressure', 'Constipation'];
    recommendations.riskFactors = ['High sodium diet', 'Excessive sweating', 'Certain medications', 'Kidney disease'];
    recommendations.icon = <Heart className="w-4 h-4 text-purple-500" />;
    recommendations.systemsAffected = ['Cardiovascular system', 'Muscular system', 'Fluid balance'];
    recommendations.category = 'minerals';
  } else if (name.includes('zinc')) {
    recommendations.foods = ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas', 'Cashews'];
    recommendations.tips = ['Zinc absorption is reduced by fiber and calcium', 'Needed for immune function and wound healing'];
    recommendations.timing = 'Take on empty stomach if tolerated, otherwise with food';
    recommendations.combinations = ['Avoid taking with iron or calcium', 'Pair with vitamin A for immune support'];
    recommendations.bodyFunction = 'Essential for immune function, wound healing, DNA synthesis, and proper growth during development. Critical for taste and smell.';
    recommendations.healthBenefits = ['Boosts immune system', 'Accelerates wound healing', 'Supports growth and development', 'Maintains sense of taste and smell'];
    recommendations.deficiencySymptoms = ['Frequent infections and slow healing', 'Loss of appetite', 'Hair loss', 'Diarrhea', 'Loss of taste or smell', 'White spots on nails'];
    recommendations.riskFactors = ['Vegetarian diet', 'Digestive disorders', 'Chronic kidney disease', 'Alcohol abuse'];
    recommendations.icon = <CheckCircle className="w-4 h-4 text-teal-500" />;
    recommendations.systemsAffected = ['Immune system', 'Sensory function', 'Cellular repair'];
    recommendations.category = 'minerals';
  } else if (name.includes('vitamin e')) {
    recommendations.foods = ['Nuts and seeds (almonds, sunflower seeds)', 'Vegetable oils (olive, sunflower)', 'Avocados', 'Spinach', 'Sweet potatoes'];
    recommendations.tips = ['Vitamin E is fat-soluble - take with meals containing healthy fats', 'Store nuts in the refrigerator to preserve vitamin E'];
    recommendations.timing = 'Take with meals containing healthy fats for optimal absorption';
    recommendations.combinations = ['Pair with vitamin C for enhanced antioxidant protection', 'Take with healthy fats like avocado or olive oil'];
    recommendations.bodyFunction = 'Powerful antioxidant that protects cell membranes from oxidative damage. Essential for immune function and skin health.';
    recommendations.healthBenefits = ['Protects against oxidative stress', 'Supports immune function', 'Promotes healthy skin', 'May reduce risk of heart disease'];
    recommendations.deficiencySymptoms = ['Muscle weakness and coordination problems', 'Vision problems', 'Immune system dysfunction', 'Nerve damage', 'Dry, rough skin'];
    recommendations.riskFactors = ['Low fat diet', 'Digestive disorders', 'Premature infants', 'Genetic disorders affecting fat absorption'];
    recommendations.icon = <Lightbulb className="w-4 h-4 text-yellow-500" />;
    recommendations.systemsAffected = ['Nervous system', 'Immune system', 'Cardiovascular system'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin k')) {
    recommendations.foods = ['Dark leafy greens (kale, spinach, collards)', 'Broccoli', 'Brussels sprouts', 'Cabbage', 'Liver'];
    recommendations.tips = ['Vitamin K is fat-soluble - cook with healthy fats', 'Fermented foods like natto are excellent sources'];
    recommendations.timing = 'Take with meals containing healthy fats';
    recommendations.combinations = ['Pair with vitamin D and calcium for bone health', 'Take with healthy fats for absorption'];
    recommendations.bodyFunction = 'Essential for blood clotting and bone health. Activates proteins that help blood clot and build strong bones.';
    recommendations.healthBenefits = ['Supports blood clotting', 'Strengthens bones', 'May reduce risk of osteoporosis', 'Supports heart health'];
    recommendations.deficiencySymptoms = ['Easy bruising and bleeding', 'Slow wound healing', 'Heavy menstrual periods', 'Bone weakness', 'Blood in urine or stool'];
    recommendations.riskFactors = ['Antibiotic use', 'Liver disease', 'Fat malabsorption disorders', 'Newborns (vitamin K deficiency bleeding)'];
    recommendations.icon = <Heart className="w-4 h-4 text-green-500" />;
    recommendations.systemsAffected = ['Circulatory system', 'Skeletal system', 'Hepatic system'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin b1') || name.includes('thiamin')) {
    recommendations.foods = ['Whole grains', 'Pork', 'Legumes', 'Nuts and seeds', 'Fortified cereals'];
    recommendations.tips = ['Thiamin is water-soluble and easily lost during cooking', 'Alcohol can interfere with thiamin absorption'];
    recommendations.timing = 'Take with meals throughout the day';
    recommendations.combinations = ['Works with other B vitamins for energy metabolism', 'Take with magnesium for optimal function'];
    recommendations.bodyFunction = 'Essential for converting carbohydrates into energy. Critical for nerve function and muscle contraction.';
    recommendations.healthBenefits = ['Supports energy production', 'Maintains nerve function', 'Supports heart health', 'Aids in muscle contraction'];
    recommendations.deficiencySymptoms = ['Fatigue and weakness', 'Irritability and confusion', 'Muscle weakness', 'Loss of appetite', 'Tingling in extremities', 'Heart problems'];
    recommendations.riskFactors = ['Alcohol abuse', 'Refined grain diet', 'Digestive disorders', 'Pregnancy and breastfeeding'];
    recommendations.icon = <Zap className="w-4 h-4 text-yellow-500" />;
    recommendations.systemsAffected = ['Nervous system', 'Muscular system', 'Energy metabolism'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin b2') || name.includes('riboflavin')) {
    recommendations.foods = ['Dairy products', 'Eggs', 'Lean meats', 'Green leafy vegetables', 'Fortified cereals'];
    recommendations.tips = ['Riboflavin is sensitive to light - store foods properly', 'Needed for energy production and antioxidant function'];
    recommendations.timing = 'Take with meals throughout the day';
    recommendations.combinations = ['Works with other B vitamins for energy metabolism', 'Take with iron for enhanced absorption'];
    recommendations.bodyFunction = 'Essential for energy production and metabolism. Acts as a coenzyme in many cellular processes and antioxidant protection.';
    recommendations.healthBenefits = ['Supports energy production', 'Maintains healthy skin and eyes', 'Supports growth and development', 'Acts as antioxidant'];
    recommendations.deficiencySymptoms = ['Cracked lips and corners of mouth', 'Sore throat', 'Swollen tongue', 'Skin rashes', 'Eye sensitivity to light', 'Fatigue'];
    recommendations.riskFactors = ['Lactose intolerance', 'Vegan diet', 'Alcohol abuse', 'Certain medications'];
    recommendations.icon = <Lightbulb className="w-4 h-4 text-blue-500" />;
    recommendations.systemsAffected = ['Energy metabolism', 'Integumentary system', 'Visual system'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin b3') || name.includes('niacin')) {
    recommendations.foods = ['Poultry', 'Fish', 'Lean meats', 'Whole grains', 'Legumes'];
    recommendations.tips = ['Niacin can cause flushing at high doses', 'Important for cholesterol management and energy production'];
    recommendations.timing = 'Take with meals to reduce flushing';
    recommendations.combinations = ['Works with other B vitamins for energy metabolism', 'Take with tryptophan-rich foods'];
    recommendations.bodyFunction = 'Essential for energy metabolism and DNA repair. Helps convert food into energy and maintains healthy skin and nerves.';
    recommendations.healthBenefits = ['Supports energy production', 'Maintains healthy skin', 'Supports nervous system', 'May help manage cholesterol'];
    recommendations.deficiencySymptoms = ['Dermatitis and skin rashes', 'Diarrhea', 'Dementia', 'Fatigue', 'Loss of appetite', 'Digestive problems'];
    recommendations.riskFactors = ['Alcohol abuse', 'Poor diet', 'Certain medications', 'Digestive disorders'];
    recommendations.icon = <Brain className="w-4 h-4 text-purple-500" />;
    recommendations.systemsAffected = ['Nervous system', 'Integumentary system', 'Digestive system'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin b6')) {
    recommendations.foods = ['Poultry', 'Fish', 'Potatoes', 'Bananas', 'Chickpeas'];
    recommendations.tips = ['Vitamin B6 is involved in over 100 enzyme reactions', 'Important for brain development and immune function'];
    recommendations.timing = 'Take with meals throughout the day';
    recommendations.combinations = ['Works with other B vitamins for energy metabolism', 'Take with magnesium for optimal function'];
    recommendations.bodyFunction = 'Essential for protein metabolism, brain development, and immune function. Critical for neurotransmitter synthesis.';
    recommendations.healthBenefits = ['Supports brain function', 'Boosts immune system', 'Aids protein metabolism', 'Supports mood regulation'];
    recommendations.deficiencySymptoms = ['Anemia', 'Skin rashes', 'Depression and confusion', 'Weakened immune system', 'Tingling in extremities', 'Seizures'];
    recommendations.riskFactors = ['Alcohol abuse', 'Certain medications', 'Kidney disease', 'Autoimmune disorders'];
    recommendations.icon = <Brain className="w-4 h-4 text-indigo-500" />;
    recommendations.systemsAffected = ['Nervous system', 'Immune system', 'Hematological system'];
    recommendations.category = 'vitamins';
  } else if (name.includes('vitamin b12')) {
    recommendations.foods = ['Animal products (meat, fish, eggs, dairy)', 'Fortified cereals', 'Nutritional yeast', 'Fortified plant milks'];
    recommendations.tips = ['Vitamin B12 is only found naturally in animal products', 'Important for nerve function and red blood cell formation'];
    recommendations.timing = 'Take with meals for better absorption';
    recommendations.combinations = ['Take with folate for optimal red blood cell formation', 'Avoid taking with vitamin C'];
    recommendations.bodyFunction = 'Essential for nerve function, DNA synthesis, and red blood cell formation. Critical for brain health and energy production.';
    recommendations.healthBenefits = ['Supports nerve function', 'Prevents anemia', 'Supports brain health', 'Boosts energy levels'];
    recommendations.deficiencySymptoms = ['Fatigue and weakness', 'Numbness and tingling in extremities', 'Memory problems', 'Mood changes', 'Pale skin', 'Shortness of breath'];
    recommendations.riskFactors = ['Vegan or vegetarian diet', 'Older adults', 'Digestive disorders', 'Certain medications'];
    recommendations.icon = <Brain className="w-4 h-4 text-cyan-500" />;
    recommendations.systemsAffected = ['Nervous system', 'Hematological system', 'Cognitive function'];
    recommendations.category = 'vitamins';
  } else if (name.includes('phosphorus')) {
    recommendations.foods = ['Dairy products', 'Meat and poultry', 'Fish', 'Nuts and seeds', 'Whole grains'];
    recommendations.tips = ['Phosphorus works closely with calcium for bone health', 'Most people get adequate phosphorus from diet'];
    recommendations.timing = 'Take with meals throughout the day';
    recommendations.combinations = ['Works with calcium and vitamin D for bone health', 'Balance with calcium intake'];
    recommendations.bodyFunction = 'Essential for bone and teeth formation, energy production, and cell membrane structure. Critical for DNA and RNA synthesis.';
    recommendations.healthBenefits = ['Builds strong bones and teeth', 'Supports energy production', 'Maintains cell membranes', 'Supports kidney function'];
    recommendations.deficiencySymptoms = ['Bone pain and weakness', 'Loss of appetite', 'Fatigue', 'Irregular breathing', 'Anxiety', 'Numbness and tingling'];
    recommendations.riskFactors = ['Kidney disease', 'Certain medications', 'Malnutrition', 'Alcohol abuse'];
    recommendations.icon = <Heart className="w-4 h-4 text-gray-500" />;
    recommendations.systemsAffected = ['Skeletal system', 'Energy metabolism', 'Renal system'];
    recommendations.category = 'minerals';
  } else if (name.includes('selenium')) {
    recommendations.foods = ['Brazil nuts', 'Seafood', 'Meat and poultry', 'Eggs', 'Whole grains'];
    recommendations.tips = ['Brazil nuts are the richest source of selenium', 'Important for thyroid function and antioxidant protection'];
    recommendations.timing = 'Take with meals throughout the day';
    recommendations.combinations = ['Works with vitamin E for antioxidant protection', 'Take with iodine for thyroid health'];
    recommendations.bodyFunction = 'Essential for thyroid hormone metabolism and antioxidant protection. Critical for immune function and DNA synthesis.';
    recommendations.healthBenefits = ['Supports thyroid function', 'Boosts immune system', 'Acts as antioxidant', 'Supports reproductive health'];
    recommendations.deficiencySymptoms = ['Muscle weakness and pain', 'Fatigue', 'Hair loss', 'Weakened immune system', 'Thyroid problems', 'Infertility'];
    recommendations.riskFactors = ['Low soil selenium areas', 'Digestive disorders', 'HIV/AIDS', 'Kidney dialysis'];
    recommendations.icon = <Target className="w-4 h-4 text-orange-500" />;
    recommendations.systemsAffected = ['Endocrine system', 'Immune system', 'Reproductive system'];
    recommendations.category = 'minerals';
  } else if (name.includes('sodium')) {
    recommendations.foods = ['Natural sources: celery, beets, spinach', 'Sea salt (use sparingly)', 'Fermented foods (in moderation)', 'Bone broth', 'Natural mineral water'];
    recommendations.tips = ['Most people consume too much sodium - aim for less than 2,300mg daily', 'Read food labels and choose low-sodium options', 'Cook at home to control sodium intake', 'Use herbs and spices instead of salt'];
    recommendations.timing = 'Limit throughout the day - avoid high sodium meals';
    recommendations.combinations = ['Balance with potassium-rich foods', 'Pair with magnesium for heart health', 'Avoid with high blood pressure'];
    recommendations.bodyFunction = 'Essential electrolyte for fluid balance and nerve function, but excessive intake can cause high blood pressure, heart disease, and kidney problems.';
    recommendations.healthBenefits = ['Maintains fluid balance', 'Supports nerve function', 'Aids muscle contraction', 'Prevents hyponatremia (low sodium)'];
    recommendations.deficiencySymptoms = ['Muscle cramps and weakness', 'Nausea and vomiting', 'Headaches and confusion', 'Fatigue and lethargy', 'Seizures in severe cases'];
    recommendations.riskFactors = ['High processed food intake', 'Fast food consumption', 'Canned and packaged foods', 'Eating out frequently', 'High blood pressure', 'Heart disease', 'Kidney problems'];
    recommendations.icon = <AlertTriangle className="w-4 h-4 text-red-500" />;
    recommendations.systemsAffected = ['Cardiovascular system', 'Nervous system', 'Renal system', 'Fluid balance'];
    recommendations.category = 'minerals';
  } else if (name.includes('fiber')) {
    recommendations.foods = ['Whole grains', 'Beans and legumes', 'Fruits with skin', 'Vegetables', 'Chia seeds'];
    recommendations.tips = ['Increase gradually to avoid digestive discomfort', 'Drink plenty of water with fiber'];
    recommendations.timing = 'Spread throughout the day with each meal';
    recommendations.combinations = ['Pair with probiotics for gut health', 'Include both soluble and insoluble fiber'];
    recommendations.bodyFunction = 'Promotes digestive health, regulates blood sugar and cholesterol levels, and supports beneficial gut bacteria.';
    recommendations.healthBenefits = ['Improves digestive health', 'Lowers cholesterol', 'Regulates blood sugar', 'Supports weight management'];
    recommendations.deficiencySymptoms = ['Constipation', 'Irregular bowel movements', 'High cholesterol', 'Blood sugar spikes', 'Increased hunger'];
    recommendations.riskFactors = ['Processed food diet', 'Low vegetable intake', 'Refined grain consumption'];
    recommendations.icon = <Apple className="w-4 h-4 text-green-500" />;
    recommendations.systemsAffected = ['Digestive system', 'Metabolic health', 'Cardiovascular system'];
    recommendations.category = 'other';
  } else if (name.includes('folate')) {
    recommendations.foods = ['Leafy greens', 'Legumes', 'Fortified cereals', 'Avocado', 'Fortified plant milks'];
    recommendations.tips = ['Folate is water-soluble and easily lost during cooking', 'Alcohol can interfere with folate absorption'];
    recommendations.timing = 'Take with meals for better absorption';
    recommendations.combinations = ['Take with vitamin B12 for optimal red blood cell formation', 'Avoid taking with vitamin C'];
    recommendations.bodyFunction = 'Essential for DNA synthesis and cell division. Critical for brain health and energy production.';
    recommendations.healthBenefits = ['Supports brain health', 'Prevents anemia', 'Boosts energy levels', 'Supports immune function'];
    recommendations.deficiencySymptoms = ['Fatigue and weakness', 'Numbness and tingling in extremities', 'Memory problems', 'Mood changes', 'Pale skin', 'Shortness of breath'];
    recommendations.riskFactors = ['Vegan or vegetarian diet', 'Older adults', 'Digestive disorders', 'Certain medications'];
    recommendations.icon = <Brain className="w-4 h-4 text-cyan-500" />;
    recommendations.systemsAffected = ['Nervous system', 'Hematological system', 'Cognitive function'];
    recommendations.category = 'vitamins';
  } else {
    recommendations.foods = ['Variety of whole foods', 'Balanced nutrient-dense meals'];
    recommendations.tips = ['Focus on whole food sources when possible'];
    recommendations.timing = 'Consistent daily intake is key';
    recommendations.combinations = ['Eat a rainbow of colors for diverse nutrients'];
    recommendations.bodyFunction = 'Supports overall health and wellbeing through various metabolic processes.';
    recommendations.healthBenefits = ['Supports general health'];
    recommendations.deficiencySymptoms = ['May vary depending on specific nutrient'];
    recommendations.riskFactors = ['Poor dietary variety'];
    recommendations.icon = <CheckCircle className="w-4 h-4" />;
    recommendations.systemsAffected = ['Overall health'];
    recommendations.category = 'other';
  }

  return recommendations;
};

const getStatusInfo = (percentOfTarget, nutrientName = '') => {
  const name = nutrientName.toLowerCase();
  
  // Special handling for sodium - high levels are bad
  if (name.includes('sodium')) {
    if (percentOfTarget <= 100) {
      return {
        status: 'excellent',
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    }
    if (percentOfTarget <= 150) {
      return {
        status: 'moderate',
        icon: <TrendingDown className="w-4 h-4 text-yellow-600" />,
        bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      };
    }
    return {
      status: 'high',
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    };
  }
  
  // Standard logic for other nutrients
  if (percentOfTarget >= 100) {
    return {
      status: 'excellent',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    };
  }
  if (percentOfTarget >= 75) {
    return {
      status: 'good',
      icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    };
  }
  if (percentOfTarget >= 50) {
    return {
      status: 'moderate',
      icon: <TrendingDown className="w-4 h-4 text-yellow-600" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    };
  }
  return {
    status: 'low',
    icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
    bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200'
  };
};

const getPriorityRecommendations = (data) => {
  // For sodium, high levels are concerning; for others, low levels are concerning
  const deficient = data.filter(n => {
    const name = n.name.toLowerCase();
    if (name.includes('sodium')) {
      return n.percentOfTarget > 150; // High sodium is concerning
    }
    return n.percentOfTarget < 70; // Low levels are concerning for other nutrients
  }).sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    // For sodium, higher percentages are more concerning
    if (nameA.includes('sodium') && nameB.includes('sodium')) {
      return b.percentOfTarget - a.percentOfTarget;
    }
    if (nameA.includes('sodium')) {
      return -1; // Sodium issues come first
    }
    if (nameB.includes('sodium')) {
      return 1;
    }
    
    // For other nutrients, lower percentages are more concerning
    return a.percentOfTarget - b.percentOfTarget;
  });
  
  if (deficient.length === 0) return null;
  
  const top3 = deficient.slice(0, 3);
  
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <Target className="w-5 h-5" />
          Priority Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {top3.map((nutrient, index) => {
            const recommendations = getDetailedRecommendations(nutrient.name, nutrient.percentOfTarget);
              return (
                <div key={nutrient.name} className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-900 dark:text-red-100">{nutrient.name}</h4>                  </div>
                  <Badge variant="destructive">
                    {Math.round(nutrient.percentOfTarget)}%
                  </Badge>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">{recommendations.tips}</p>
                </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const EnhancedMicronutrientReport = ({ data, loading }) => {

  // Always render the enhanced UI, even with no data
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!data || data.length === 0) {
    return (
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Apple className="w-5 h-5" />
            Enhanced Micronutrient Analysis
          </CardTitle>
          <p className="text-sm text-orange-600">
            Your comprehensive vitamin and mineral dashboard with personalized recommendations
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Apple className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-orange-800">No micronutrient data available</h3>
            <p className="text-sm text-orange-600 mb-4">
              Start logging meals with detailed nutrition information to see your comprehensive vitamin and mineral analysis with personalized recommendations.
            </p>
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              Enhanced reporting ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('🧪 ENHANCED MICRONUTRIENT REPORT: Rendering with data count:', data.length);

  // Categorize nutrients by status
  const deficientNutrients = data.filter(n => {
    const name = n.name.toLowerCase();
    if (name.includes('sodium')) {
      return n.percentOfTarget > 150; // High sodium is concerning
    }
    return n.percentOfTarget < 70; // Low levels are concerning for other nutrients
  });
  const excellentNutrients = data.filter(n => {
    const name = n.name.toLowerCase();
    if (name.includes('sodium')) {
      return n.percentOfTarget <= 100; // Low sodium is excellent
    }
    return n.percentOfTarget >= 100; // High levels are excellent for other nutrients
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNutrient, setSelectedNutrient] = useState(null);

  const filteredNutrients = data.filter(nutrient => {
    const matchesSearch = nutrient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const deailedData = getDetailedRecommendations(nutrient.name, nutrient.percentOfTarget);
    const matchesCategory = selectedCategory === "all" || deailedData.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (percentOfTarget) => {
    if (percentOfTarget >= 100) return "success";
    if (percentOfTarget >= 75) return "success";
    if (percentOfTarget >= 50) return "default";
    if (percentOfTarget >= 30) return "warning";
    return "destructive";
  };

  const getStatusIcon = (percentOfTarget) => {
    if (percentOfTarget >= 75) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (percentOfTarget >= 50) {
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
    } else if (percentOfTarget >= 30) {
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/20">

      <div className="container mx-auto p-4 space-y-6">

        {/* Status Summary - Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="premium-card bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/40 border-l-4 border-l-green-500">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-green-700 dark:text-green-400">{excellentNutrients.length}</div>
                  <p className="text-lg font-medium text-green-600 dark:text-green-500">Meeting Goals</p>
                  <p className="text-sm text-green-500/80">Optimal levels achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-r from-orange-50/80 to-amber-50/80 dark:from-orange-950/40 dark:to-amber-950/40 border-l-4 border-l-orange-500">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-orange-700 dark:text-orange-400">{data.filter(n => n.percentOfTarget >= 70 && n.percentOfTarget < 100).length}</div>
                  <p className="text-lg font-medium text-orange-600 dark:text-orange-500">Close to Goals</p>
                  <p className="text-sm text-orange-500/80">Minor adjustments needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/40 dark:to-rose-950/40 border-l-4 border-l-red-500">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-red-700 dark:text-red-400">{deficientNutrients.length}</div>
                  <p className="text-lg font-medium text-red-600 dark:text-red-500">Need Attention</p>
                  <p className="text-sm text-red-500/80">Immediate focus required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nutrients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
            >
              All
            </Button>
            <Button 
              variant={selectedCategory === "vitamins" ? "default" : "outline"}
              onClick={() => setSelectedCategory("vitamins")}
              size="sm"
            >
              Vitamins
            </Button>
            <Button 
              variant={selectedCategory === "minerals" ? "default" : "outline"}
              onClick={() => setSelectedCategory("minerals")}
              size="sm"
            >
              Minerals
            </Button>
          </div>
        </div>

        {getPriorityRecommendations(data)}
        {deficientNutrients.length > 0 && (
        <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Nutritional Focus Needed:</strong> You're below target for {deficientNutrients.length} essential nutrients. 
            Check the detailed recommendations below to optimize your intake with specific food combinations and timing.
          </AlertDescription>
        </Alert>
      )}
        {/* Micronutrient Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNutrients.map((nutrient) => {
            return (
              <Card 
                key={nutrient.name} 
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => setSelectedNutrient(nutrient)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <CircularProgress 
                      value={Math.round(nutrient.percentOfTarget)} 
                      size={80}
                      color={getStatusColor(nutrient.percentOfTarget)}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">{Math.round(nutrient.percentOfTarget)}%</div>
                      </div>
                    </CircularProgress>
                    
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold">{nutrient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {nutrient.value} / {nutrient.target} {nutrient.unit}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        {getStatusIcon(nutrient.percentOfTarget)}
                        <Badge variant={nutrient.percentOfTarget >= 100 ? "default" : 
                                      nutrient.percentOfTarget >= 75 ? "secondary" : "destructive"}>
                          {nutrient.percentOfTarget}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Nutrient Detail Modal */}
        {selectedNutrient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedNutrient(null)}>
            {(() => {
              const statusInfo = getStatusInfo(selectedNutrient.percentOfTarget, selectedNutrient.name);
              return (
                <Card className={`w-full max-w-md border-2 ${statusInfo.borderColor} ${statusInfo.bgColor} hover:shadow-lg transition-shadow`} onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedNutrient.name}
                    <Button variant="ghost" size="sm" onClick={() => setSelectedNutrient(null)}>×</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <CircularProgress 
                      value={Math.round(selectedNutrient.percentOfTarget)} 
                      size={120}
                      color={getStatusColor(selectedNutrient.percentOfTarget)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {(() => {
                      const recommendations = getDetailedRecommendations(selectedNutrient.name, selectedNutrient.percentOfTarget);
                      return (
                        <>
                          <div>
                            <h4 className="font-medium mb-1">What it does</h4>
                            <p className="text-sm text-muted-foreground">{recommendations.bodyFunction}</p>
                          </div>
                          
                          <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Apple className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Best Sources:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recommendations.foods.slice(0, 4).map((food, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                                              {/* Timing Advice */}
                    {recommendations.timing && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-blue-700">{recommendations.timing}</span>
                      </div>
                    )}
                    {recommendations.tips.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-amber-700 font-medium">Pro tip: {recommendations.tips[0]}</span>
                      </div>
                    )}
                          {recommendations.combinations.length > 0 && (
                      <div className="bg-white/50 p-2 rounded border">
                        <span className="text-xs font-medium text-gray-600">Combine with: </span>
                        <span className="text-xs text-gray-600">{recommendations.combinations[0]}</span>
                      </div>
                    )}
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
              );
            })()}
           
          </div>
        )}
      </div>
    </div>
    </div>
  );
};
