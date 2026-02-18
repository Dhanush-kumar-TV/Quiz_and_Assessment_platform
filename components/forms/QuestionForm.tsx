import { useRef, useId } from "react";
import { 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Check, 
  Plus, 
  List, 
  Hash, 
  Clock, 
  Tag 
} from "lucide-react";
import Image from "next/image";

interface QuestionOption { text: string; image?: string; isCorrect: boolean; }
interface Question { questionText: string; type?: string; points?: number; timeLimit?: number; category?: string; required?: boolean; options: QuestionOption[]; image?: string; }

export default function QuestionForm({ question, onChange }: { question: Question, onChange: (updated: Question) => void }) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const baseId = useId();

  const handleTypeChange = (type: string) => {
    onChange({ ...question, type });
  };

  const handleQuestionTextChange = (text: string) => {
    onChange({ ...question, questionText: text });
  };

  const handlePointsChange = (points: number) => {
    onChange({ ...question, points });
  };

  const handleRequiredChange = (required: boolean) => {
    onChange({ ...question, required });
  };

  const handleQuestionTimerChange = (seconds: number) => {
    onChange({ ...question, timeLimit: seconds });
  };

  const handleCategoryChange = (category: string) => {
    onChange({ ...question, category });
  };

  const handleOptionChange = (optionIndex: number, text: string) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], text };
    onChange({ ...question, options: newOptions });
  };

  const handleImageChange = (optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert("Image must be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newOptions = [...question.options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], image: reader.result as string };
      onChange({ ...question, options: newOptions });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (optionIndex: number) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], image: "" };
    onChange({ ...question, options: newOptions });
  };

  const toggleCorrect = (optionIndex: number) => {
    const newOptions = question.options.map((opt: QuestionOption, i: number) => ({
      ...opt,
      isCorrect: i === optionIndex
    }));
    onChange({ ...question, options: newOptions });
  };

  const addOption = () => {
    if (question.options.length < 6) {
      onChange({ ...question, options: [...question.options, { text: "", image: "", isCorrect: false }] });
    }
  };

  const removeOption = (index: number) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_: QuestionOption, i: number) => i !== index);
      if (!newOptions.some((opt: QuestionOption) => opt.isCorrect)) {
        newOptions[0].isCorrect = true;
      }
      onChange({ ...question, options: newOptions });
    }
  };

  return (
    <div className="space-y-8">
      {/* Type Selector */}
      <div className="flex flex-wrap gap-4">
        {[
          { id: "multiple-choice", label: "Multiple Choice", icon: List },
          { id: "picture-choice", label: "Picture Choice", icon: ImageIcon }
        ].map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => handleTypeChange(type.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
              question.type === type.id 
              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
              : "bg-secondary/50 border-secondary text-muted-foreground hover:border-primary/50"
            }`}
          >
            <type.icon className="w-4 h-4" />
            {type.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={`${baseId}-required`}
                        checked={question.required}
                        onChange={(e) => handleRequiredChange(e.target.checked)}
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-border"
                    />
                    <label htmlFor={`${baseId}-required`} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">Required</label>
                </div>
                <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</span>
                    <input 
                        type="text" 
                        className="w-24 px-2 py-1 bg-secondary/50 border border-border/50 rounded-lg text-xs font-bold focus:outline-none focus:border-primary transition-all"
                        placeholder="General"
                        value={question.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-xl border border-secondary/50">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Q-Timer (s)</span>
                    <input 
                        type="number" 
                        min={0}
                        className="w-12 bg-transparent text-sm font-black focus:outline-none text-center"
                        value={question.timeLimit}
                        onChange={(e) => handleQuestionTimerChange(parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-xl border border-secondary/50">
                    <Hash className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Points</span>
                    <input 
                        type="number" 
                        min={1}
                        className="w-8 bg-transparent text-sm font-black focus:outline-none text-center"
                        value={question.points}
                        onChange={(e) => handlePointsChange(parseInt(e.target.value) || 1)}
                    />
                </div>
            </div>
          </div>
          <textarea
            className="w-full px-6 py-4 rounded-2xl border-2 border-secondary bg-white dark:bg-slate-800/50 focus:border-primary focus:outline-none transition-all text-xl font-bold dark:text-slate-100 placeholder:text-muted-foreground/30"
            placeholder="Type your question prompt here..."
            rows={2}
            value={question.questionText}
            onChange={(e) => handleQuestionTextChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {question.options.map((option: QuestionOption, i: number) => (
            <div key={i} className="group relative">
              <div className={`p-4 rounded-3xl border-2 transition-all ${
                option.isCorrect 
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                : "border-secondary bg-slate-50/50 dark:bg-slate-800/20 hover:border-primary/30"
              }`}>
                <div className="flex items-start gap-4">
                    <button
                    type="button"
                    onClick={() => toggleCorrect(i)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      option.isCorrect ? "bg-primary border-primary text-white" : "border-muted-foreground/30"
                    }`}
                  >
                    {option.isCorrect && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                  </button>

                  <div className="flex-grow space-y-4">
                    <input
                      type="text"
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold text-foreground placeholder:text-muted-foreground/30"
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                    />

                    {question.type === "picture-choice" && (
                      <div className="relative">
                        {option.image ? (
                          <div className="relative group/img w-full aspect-video rounded-2xl overflow-hidden border border-border bg-secondary/30">
                            <Image src={option.image} alt="Option choice" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRefs.current[i]?.click()}
                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-all"
                                >
                                    <Upload className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5 text-white" />
                                </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[i]?.click()}
                            className="w-full py-8 rounded-2xl border-2 border-dashed border-secondary hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center gap-2 text-muted-foreground hover:text-primary group/upload"
                          >
                            <div className="p-3 rounded-xl bg-secondary group-hover/upload:bg-primary/10 transition-colors">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Add Image</span>
                          </button>
                        )}
                        <input
                          type="file"
                          ref={el => { fileInputRefs.current[i] = el; }}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(i, e)}
                        />
                      </div>
                    )}
                  </div>

                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {question.options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="flex items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-secondary text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="p-2 rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-black text-sm uppercase tracking-widest">Add Option</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
