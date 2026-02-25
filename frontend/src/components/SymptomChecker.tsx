import React, { useState } from 'react';
import { Brain, Search, AlertTriangle, Pill, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MedicineSuggestion {
  condition: string;
  medication: string;
  dosage: string;
  notes: string;
}

const SYMPTOM_RULES: Array<{
  keywords: string[];
  condition: string;
  medication: string;
  dosage: string;
  notes: string;
}> = [
  {
    keywords: ['cold', 'runny nose', 'sneezing', 'nasal', 'congestion', 'blocked nose'],
    condition: 'Common Cold / Allergic Rhinitis',
    medication: 'Levocetrizine 5mg',
    dosage: '1 tablet once daily at night',
    notes: 'Take after food. Avoid driving as it may cause drowsiness. Stay hydrated.',
  },
  {
    keywords: ['fever', 'temperature', 'chills', 'sweating', 'hot', 'pyrexia'],
    condition: 'Fever / Pyrexia',
    medication: 'Paracetamol 500mg',
    dosage: '1–2 tablets every 4–6 hours as needed (max 8 tablets/day)',
    notes: 'Do not exceed recommended dose. Drink plenty of fluids. Seek medical attention if fever exceeds 103°F.',
  },
  {
    keywords: ['headache', 'migraine', 'head pain', 'throbbing', 'head ache'],
    condition: 'Headache / Migraine',
    medication: 'Ibuprofen 400mg',
    dosage: '1 tablet every 6–8 hours with food',
    notes: 'Take with food to avoid stomach upset. Avoid if you have stomach ulcers or kidney issues.',
  },
  {
    keywords: ['stomach', 'stomach ache', 'indigestion', 'acidity', 'gas', 'bloating', 'nausea', 'vomiting', 'upset stomach'],
    condition: 'Stomach Discomfort / Indigestion',
    medication: 'Pudina Hara (Mint Drops)',
    dosage: '10–15 drops in half a glass of water, 2–3 times daily',
    notes: 'Natural remedy. Effective for gas, bloating, and mild indigestion. Consult doctor for severe pain.',
  },
  {
    keywords: ['cough', 'dry cough', 'wet cough', 'throat', 'sore throat', 'phlegm', 'mucus'],
    condition: 'Cough / Throat Irritation',
    medication: 'Benadryl Cough Syrup',
    dosage: '10ml (2 teaspoons) 3 times daily',
    notes: 'Shake well before use. May cause drowsiness. Avoid alcohol. Consult doctor if cough persists > 7 days.',
  },
  {
    keywords: ['diarrhea', 'loose motion', 'loose stool', 'watery stool', 'dysentery'],
    condition: 'Diarrhea / Loose Motion',
    medication: 'ORS (Oral Rehydration Salts) + Loperamide 2mg',
    dosage: 'ORS: 1 sachet in 1L water after each loose stool. Loperamide: 1 tablet after first loose stool, then 1 after each subsequent stool (max 4/day)',
    notes: 'Stay hydrated. Avoid dairy and spicy food. Seek medical attention if blood in stool or fever present.',
  },
  {
    keywords: ['back pain', 'backache', 'lower back', 'spine', 'muscle pain', 'body ache', 'joint pain', 'arthritis'],
    condition: 'Back Pain / Muscle Ache',
    medication: 'Diclofenac 50mg',
    dosage: '1 tablet twice daily after meals',
    notes: 'Take with food. Apply warm compress for additional relief. Avoid prolonged use without medical supervision.',
  },
  {
    keywords: ['anxiety', 'stress', 'panic', 'nervous', 'restless', 'worry', 'tension'],
    condition: 'Anxiety / Stress',
    medication: 'Ashwagandha Extract 300mg',
    dosage: '1 capsule twice daily with warm milk',
    notes: 'Natural adaptogen. Results may take 2–4 weeks. Consult a doctor for severe anxiety or panic attacks.',
  },
  {
    keywords: ['insomnia', 'sleep', 'sleepless', 'cant sleep', "can't sleep", 'trouble sleeping', 'awake at night'],
    condition: 'Insomnia / Sleep Difficulty',
    medication: 'Melatonin 3mg',
    dosage: '1 tablet 30 minutes before bedtime',
    notes: 'Avoid screens 1 hour before bed. Do not drive after taking. Not recommended for long-term use without medical advice.',
  },
  {
    keywords: ['allergy', 'allergic', 'rash', 'itching', 'hives', 'skin rash', 'urticaria'],
    condition: 'Allergic Reaction / Skin Rash',
    medication: 'Cetirizine 10mg',
    dosage: '1 tablet once daily at night',
    notes: 'May cause drowsiness. Avoid alcohol. Seek immediate medical attention for severe allergic reactions (difficulty breathing, swelling of face/throat).',
  },
];

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<MedicineSuggestion[]>([]);
  const [searched, setSearched] = useState(false);

  const handleCheck = () => {
    if (!symptoms.trim()) return;
    const lower = symptoms.toLowerCase();
    const matches: MedicineSuggestion[] = [];

    for (const rule of SYMPTOM_RULES) {
      if (rule.keywords.some((kw) => lower.includes(kw))) {
        matches.push({
          condition: rule.condition,
          medication: rule.medication,
          dosage: rule.dosage,
          notes: rule.notes,
        });
      }
    }

    setResults(matches);
    setSearched(true);
  };

  const handleClear = () => {
    setSymptoms('');
    setResults([]);
    setSearched(false);
  };

  return (
    <Card className="border-l-4 border-r-4 border-teal-500 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Brain className="w-5 h-5 text-teal-600" />
          AI Symptom Checker
        </CardTitle>
        <p className="text-sm text-gray-500">
          Describe your symptoms in plain language and get instant medicine suggestions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I have a headache and fever since yesterday, also feeling nauseous..."
            rows={4}
            className="border-teal-200 focus:border-teal-500 resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCheck}
            disabled={!symptoms.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white flex-1"
          >
            <Search className="w-4 h-4 mr-2" />
            Check Symptoms
          </Button>
          {searched && (
            <Button variant="outline" onClick={handleClear} className="border-teal-200 text-teal-700">
              Clear
            </Button>
          )}
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-3 pt-2">
            {results.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <Brain className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No matching conditions found.</p>
                <p className="text-xs mt-1">Try describing your symptoms differently or consult a doctor.</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">
                  Found {results.length} suggestion{results.length > 1 ? 's' : ''}:
                </p>
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-teal-100 rounded-lg p-4 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                        {result.condition}
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2">
                      <Pill className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{result.medication}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          <span className="font-medium">Dosage:</span> {result.dosage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 rounded p-2">
                      <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700">{result.notes}</p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3 mt-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600">
                <strong>Disclaimer:</strong> These suggestions are for informational purposes only and are not a substitute for professional medical advice. Always consult a qualified healthcare provider before taking any medication.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
