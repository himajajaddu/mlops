import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Database, PlayCircle, GitBranch, Terminal } from "lucide-react";

export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
       <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-display font-bold">Documentation</h1>
        <p className="text-xl text-muted-foreground">Guide to the Heart Disease MLOps Pipeline.</p>
      </div>

      <div className="grid gap-8">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Dataset</h2>
          </div>
          <Card>
            <CardContent className="pt-6 prose prose-slate max-w-none">
              <p>
                The model is trained on the <span className="font-semibold text-foreground">UCI Heart Disease Dataset</span> (Cleveland database). 
                It contains 76 attributes, but all published experiments refer to using a subset of 14 of them.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Age, Sex, Chest Pain Type</li>
                    <li>Resting Blood Pressure</li>
                    <li>Serum Cholestoral</li>
                    <li>Fasting Blood Sugar</li>
                    <li>Resting Electrocardiographic Results</li>
                  </ul>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">Target Variable</h4>
                  <p className="text-sm text-muted-foreground">
                    The "goal" field refers to the presence of heart disease in the patient. 
                    It is integer valued from 0 (no presence) to 4. We treat this as a binary classification problem (0 vs 1+).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Terminal className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">API Reference</h2>
          </div>
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="bg-secondary/50 px-6 py-3 border-b border-border flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">GET</span>
                <code className="text-sm font-mono">/api/predictions</code>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Retrieve a list of all past predictions made by the system.</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-secondary/50 px-6 py-3 border-b border-border flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">POST</span>
                <code className="text-sm font-mono">/api/predictions</code>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">Create a new prediction using the model inference engine.</p>
                <div className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto">
<pre className="text-xs text-gray-300 font-mono">
{`{
  "age": 63,
  "sex": 1,
  "cp": 3,
  "trestbps": 145,
  "chol": 233,
  "fbs": 1,
  "restecg": 0,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 2.3,
  "slope": 0,
  "ca": 0,
  "thal": 1
}`}
</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <GitBranch className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold">Pipeline Architecture</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-6">
                The application follows a standard MLOps architecture separating the model training (offline) from the inference API (online).
              </p>
              
              <div className="relative p-6 border border-border rounded-xl bg-secondary/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-center">
                  <div className="p-4 bg-card shadow-sm border rounded-lg w-full md:w-32">
                    Data Ingestion
                  </div>
                  <div className="hidden md:block h-px w-12 bg-border"></div>
                  <div className="p-4 bg-card shadow-sm border rounded-lg w-full md:w-32">
                    Preprocessing
                  </div>
                  <div className="hidden md:block h-px w-12 bg-border"></div>
                   <div className="p-4 bg-primary text-primary-foreground shadow-lg rounded-lg w-full md:w-32">
                    Model Training
                  </div>
                  <div className="hidden md:block h-px w-12 bg-border"></div>
                   <div className="p-4 bg-card shadow-sm border rounded-lg w-full md:w-32">
                    REST API
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
