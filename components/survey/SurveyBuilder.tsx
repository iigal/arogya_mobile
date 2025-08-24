import { useMemo, useState } from "react";

import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View, useWindowDimensions
} from "react-native";
import { api } from "../../api";
import AddQuestion from "./ui/AddQuestion";
import FormPreview from "./ui/FormPreview";
import FormSettings from "./ui/FormSettings";
import QuestionList from "./ui/QuestionList";
import QuestionSettings from "./ui/QuestionSettings";
import { TopBar } from "./ui/TopBar";

export type QuestionType =
  | "Short Text" | "Long Text" | "Multiple Choice" | "Rating Scale" | "Yes/No" | "Date" | "Number";

export type Question = {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  scaleMax?: number;
};

export default function SurveyBuilder() {
  const [formTitle, setFormTitle] = useState("Patient Satisfaction Survey");
  const [formDesc, setFormDesc] = useState("Please help us improve our services by completing this survey.");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "q1", type: "Number", title: "what", required: false },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>("q1");
  const [showPreview, setShowPreview] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const selected = useMemo(
    () => questions.find((q) => q.id === selectedId) ?? null,
    [questions, selectedId]
  );

  const addQuestion = (type: QuestionType) => {
    const base: Question = { id: `${Date.now()}`, type, title: "New Question", required: false };
    const withDefaults: Question =
      type === "Multiple Choice" ? { ...base, options: ["Option 1", "Option 2"] } :
      type === "Rating Scale" ? { ...base, scaleMax: 5 } : base;

    setQuestions((prev) => [...prev, withDefaults]);
    setSelectedId(withDefaults.id);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const move = (id: string, dir: "up" | "down") => {
    setQuestions((prev) => {
      const i = prev.findIndex((q) => q.id === id);
      if (i < 0) return prev;
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // PREVIEW
  const onPreview = () => setShowPreview(true);


const onSave = async () => {
  try {
    // Map UI question types to backend model fields
    const mapType = (t: QuestionType): 'text' | 'number' | 'choice' => {
      switch (t) {
        case 'Number':
          return 'number';
        case 'Multiple Choice':
          return 'choice';
        // Backend supports only text/number/choice; map others to text
        default:
          return 'text';
      }
    };

    const payload = {
      // Backend expects `name` instead of `title`
      name: formTitle.trim(),
      description: formDesc.trim(),
      questions: questions.map(q => ({
        title: q.title?.trim() || "",
        description: q.description?.trim() || "",
        required: !!q.required,
        question_type: mapType(q.type),
      })),
    };

    // Send to backend
    const response = await api.post("/api/surveys/", payload);

    if (response.status === 201 || response.status === 200) {
      Alert.alert("Saved ✅", "Your form has been saved to the server.");
    } else {
      Alert.alert("Save failed", "Unexpected response from server.");
    }
  } catch (e: any) {
    Alert.alert("Save failed", String(e));
  }
};


  return (
    <View style={styles.root}>
      <TopBar onPreview={onPreview} onSave={onSave} />

      {isWide ? (
        <View style={styles.columns}>
          <View style={[styles.col, { flex: 1.2 }]}>
            <FormSettings
              title={formTitle}
              description={formDesc}
              onChangeTitle={setFormTitle}
              onChangeDescription={setFormDesc}
            />
            <AddQuestion onAdd={addQuestion} />
          </View>

          <View style={[styles.col, { flex: 1.8 }]}>
            <QuestionList
              questions={questions}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={deleteQuestion}
              onMove={move}
            />
          </View>

          <View style={[styles.col, { flex: 1.2 }]}>
            {selected && (
              <QuestionSettings key={selected.id} question={selected} onChange={updateQuestion} />
            )}
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.stack}>
          <FormSettings
            title={formTitle}
            description={formDesc}
            onChangeTitle={setFormTitle}
            onChangeDescription={setFormDesc}
          />
          <AddQuestion onAdd={addQuestion} />
          <QuestionList
            questions={questions}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={deleteQuestion}
            onMove={move}
          />
          {selected && (
            <QuestionSettings key={selected.id} question={selected} onChange={updateQuestion} />
          )}
        </ScrollView>
      )}

      {/* PREVIEW MODAL */}
      <Modal visible={showPreview} animationType="slide" onRequestClose={() => setShowPreview(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <FormPreview title={formTitle} description={formDesc} questions={questions} />
            <Pressable onPress={() => setShowPreview(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close Preview</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: 12 },
  columns: { flex: 1, flexDirection: "row", gap: 12 },
  stack: { gap: 12, paddingBottom: 24 },
  col: { gap: 12 },
  closeBtn: {
    alignSelf: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeText: { color: "#fff", fontWeight: "700" },
});