import { useCreatePrediction } from "@/hooks/use-predictions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPredictionSchema, type InsertPrediction } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { z } from "zod";

// Extend schema for form to handle string inputs before coercion
const formSchema = insertPredictionSchema.extend({
    age: z.coerce.number().min(1, "Age is required"),
    sex: z.coerce.number(),
    cp: z.coerce.number(),
    trestbps: z.coerce.number().min(1, "Resting BP is required"),
    chol: z.coerce.number().min(1, "Cholesterol is required"),
    fbs: z.coerce.number(),
    restecg: z.coerce.number(),
    thalach: z.coerce.number().min(1, "Max HR is required"),
    exang: z.coerce.number(),
    oldpeak: z.coerce.number(),
    slope: z.coerce.number(),
    ca: z.coerce.number(),
    thal: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Demo() {
  const mutation = useCreatePrediction();
  const [result, setResult] = useState<{ prediction: number, probability: number } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: 1,
      cp: 0,
      fbs: 0,
      restecg: 0,
      exang: 0,
      slope: 1,
      ca: 0,
      thal: 2,
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data, {
      onSuccess: (response) => {
        setResult({
          prediction: response.prediction,
          probability: response.probability
        });
        // Scroll to result
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-bold">Model Demo</h1>
        <p className="text-muted-foreground">Input patient data to generate a real-time risk assessment.</p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-xl border ${result.prediction === 1 ? 'bg-destructive/10 border-destructive/20' : 'bg-green-500/10 border-green-500/20'} mb-8`}
          >
            <div className="flex items-start gap-4">
              {result.prediction === 1 ? (
                <AlertTriangle className="w-8 h-8 text-destructive shrink-0" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
              )}
              <div>
                <h3 className={`text-xl font-bold ${result.prediction === 1 ? 'text-destructive' : 'text-green-700'}`}>
                  {result.prediction === 1 ? 'High Risk Detected' : 'Low Risk Assessment'}
                </h3>
                <p className="text-foreground/80 mt-1">
                  The model predicts a <strong>{(result.probability * 100).toFixed(1)}%</strong> probability of heart disease based on the provided clinical features.
                </p>
                <button 
                  onClick={() => { setResult(null); form.reset(); }}
                  className="mt-4 text-sm font-medium underline opacity-70 hover:opacity-100"
                >
                  Start new prediction
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <Card className="lg:col-span-2 border-primary/20 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" />
              Clinical Features
            </CardTitle>
            <CardDescription>Enter standard patient metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" placeholder="e.g. 54" {...form.register("age")} />
                  {form.formState.errors.age && <span className="text-xs text-destructive">{form.formState.errors.age.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Controller
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Male</SelectItem>
                          <SelectItem value="0">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chest Pain Type (CP)</Label>
                  <Controller
                    control={form.control}
                    name="cp"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Typical Angina</SelectItem>
                          <SelectItem value="1">Atypical Angina</SelectItem>
                          <SelectItem value="2">Non-anginal Pain</SelectItem>
                          <SelectItem value="3">Asymptomatic</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resting BP (Trestbps)</Label>
                  <Input type="number" placeholder="mm Hg" {...form.register("trestbps")} />
                  {form.formState.errors.trestbps && <span className="text-xs text-destructive">{form.formState.errors.trestbps.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label>Cholesterol (Chol)</Label>
                  <Input type="number" placeholder="mg/dl" {...form.register("chol")} />
                </div>

                <div className="space-y-2">
                  <Label>Fasting Blood Sugar &gt; 120 (Fbs)</Label>
                   <Controller
                    control={form.control}
                    name="fbs"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">True</SelectItem>
                          <SelectItem value="0">False</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resting ECG (Restecg)</Label>
                   <Controller
                    control={form.control}
                    name="restecg"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Normal</SelectItem>
                          <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                          <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Heart Rate (Thalach)</Label>
                  <Input type="number" placeholder="BPM" {...form.register("thalach")} />
                </div>

                <div className="space-y-2">
                  <Label>Exercise Angina (Exang)</Label>
                   <Controller
                    control={form.control}
                    name="exang"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Yes</SelectItem>
                          <SelectItem value="0">No</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>ST Depression (Oldpeak)</Label>
                  <Input type="number" step="0.1" placeholder="e.g. 2.5" {...form.register("oldpeak")} />
                </div>

                 <div className="space-y-2">
                  <Label>Slope of Peak ST (Slope)</Label>
                   <Controller
                    control={form.control}
                    name="slope"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select slope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Upsloping</SelectItem>
                          <SelectItem value="1">Flat</SelectItem>
                          <SelectItem value="2">Downsloping</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                
                 <div className="space-y-2">
                  <Label>Major Vessels (CA)</Label>
                   <Controller
                    control={form.control}
                    name="ca"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of vessels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                 <div className="space-y-2">
                  <Label>Thalassemia (Thal)</Label>
                   <Controller
                    control={form.control}
                    name="thal"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Normal</SelectItem>
                          <SelectItem value="2">Fixed Defect</SelectItem>
                          <SelectItem value="3">Reversable Defect</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {mutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
                {mutation.isPending ? "Processing..." : "Run Prediction Model"}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-secondary/30 border-none">
            <CardHeader>
              <CardTitle className="text-lg">About the Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                This model uses a <strong>Logistic Regression</strong> classifier trained on the UCI Heart Disease dataset.
              </p>
              <p>
                It evaluates 13 clinical features to determine the likelihood of heart disease presence.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Accuracy: ~88%</li>
                <li>Recall: ~91%</li>
                <li>F1-Score: ~89%</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Usage Note</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                This tool is for demonstration and educational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
