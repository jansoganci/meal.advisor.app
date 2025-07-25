import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

interface Substitution {
  original: string;
  substitute: string;
  reason: string;
}

interface InstructionsCardProps {
  ingredients: Ingredient[];
  instructions: string[];
  substitutions?: Substitution[];
  tips?: string[];
  title?: string;
}

export const InstructionsCard: React.FC<InstructionsCardProps> = ({
  ingredients,
  instructions,
  substitutions = [],
  tips = [],
  title = 'Cooking Instructions'
}) => {
  const [showIngredients, setShowIngredients] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubstitutions, setShowSubstitutions] = useState(substitutions.length > 0);
  const [showTips, setShowTips] = useState(tips.length > 0);

  const toggleSection = (section: 'ingredients' | 'instructions' | 'substitutions' | 'tips') => {
    switch (section) {
      case 'ingredients':
        setShowIngredients(!showIngredients);
        break;
      case 'instructions':
        setShowInstructions(!showInstructions);
        break;
      case 'substitutions':
        setShowSubstitutions(!showSubstitutions);
        break;
      case 'tips':
        setShowTips(!showTips);
        break;
    }
  };

  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.title}>{title}</ThemedText>

      {/* Ingredients Section */}
      <ThemedView style={styles.section}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection('ingredients')}
        >
          <ThemedText style={styles.sectionTitle}>📋 Ingredients</ThemedText>
          <ThemedText style={styles.toggleIcon}>
            {showIngredients ? '▼' : '▶'}
          </ThemedText>
        </TouchableOpacity>
        
        {showIngredients && (
          <ThemedView style={styles.sectionContent}>
            {ingredients.map((ingredient, index) => (
              <ThemedView key={index} style={styles.ingredientItem}>
                <ThemedText style={styles.ingredientText}>
                  • {ingredient.amount} {ingredient.unit} {ingredient.name}
                  {ingredient.notes && (
                    <ThemedText style={styles.ingredientNotes}>
                      {' '}({ingredient.notes})
                    </ThemedText>
                  )}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>

      {/* Instructions Section */}
      <ThemedView style={styles.section}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection('instructions')}
        >
          <ThemedText style={styles.sectionTitle}>👨‍🍳 Instructions</ThemedText>
          <ThemedText style={styles.toggleIcon}>
            {showInstructions ? '▼' : '▶'}
          </ThemedText>
        </TouchableOpacity>
        
        {showInstructions && (
          <ThemedView style={styles.sectionContent}>
            {instructions.map((instruction, index) => (
              <ThemedView key={index} style={styles.instructionItem}>
                <ThemedView style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.instructionText}>
                  {instruction}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>

      {/* Substitutions Section */}
      {substitutions.length > 0 && (
        <ThemedView style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('substitutions')}
          >
            <ThemedText style={styles.sectionTitle}>🔄 Substitutions</ThemedText>
            <ThemedText style={styles.toggleIcon}>
              {showSubstitutions ? '▼' : '▶'}
            </ThemedText>
          </TouchableOpacity>
          
          {showSubstitutions && (
            <ThemedView style={styles.sectionContent}>
              {substitutions.map((substitution, index) => (
                <ThemedView key={index} style={styles.substitutionItem}>
                  <ThemedText style={styles.substitutionText}>
                    <ThemedText style={styles.originalText}>
                      {substitution.original}
                    </ThemedText>
                    {' → '}
                    <ThemedText style={styles.substituteText}>
                      {substitution.substitute}
                    </ThemedText>
                  </ThemedText>
                  <ThemedText style={styles.substitutionReason}>
                    ({substitution.reason})
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ThemedView>
      )}

      {/* Tips Section */}
      {tips.length > 0 && (
        <ThemedView style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('tips')}
          >
            <ThemedText style={styles.sectionTitle}>💡 Tips</ThemedText>
            <ThemedText style={styles.toggleIcon}>
              {showTips ? '▼' : '▶'}
            </ThemedText>
          </TouchableOpacity>
          
          {showTips && (
            <ThemedView style={styles.sectionContent}>
              {tips.map((tip, index) => (
                <ThemedView key={index} style={styles.tipItem}>
                  <ThemedText style={styles.tipText}>
                    💡 {tip}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  toggleIcon: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  sectionContent: {
    paddingTop: 12,
  },
  ingredientItem: {
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  ingredientNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: '#FF6B35',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    flex: 1,
  },
  substitutionItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  substitutionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  originalText: {
    fontWeight: '500',
    color: '#dc3545',
  },
  substituteText: {
    fontWeight: '500',
    color: '#28a745',
  },
  substitutionReason: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  tipItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 