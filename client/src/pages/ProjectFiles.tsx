import { useProjectStructure, useProjectFile } from "@/hooks/use-project";
import { Card } from "@/components/ui/card";
import { Folder, File, ChevronRight, ChevronDown, Download, FileText } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// Types derived from schema
type ProjectFile = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: ProjectFile[];
};

// Recursive Tree Component
const FileNode = ({ node, level = 0, onSelect, selectedPath }: { node: ProjectFile, level?: number, onSelect: (path: string) => void, selectedPath: string | null }) => {
  const [isOpen, setIsOpen] = useState(level === 0); // Open root by default
  const isSelected = selectedPath === node.path;
  
  if (node.type === 'directory') {
    return (
      <div>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 py-1.5 px-2 hover:bg-secondary/50 rounded cursor-pointer text-sm select-none transition-colors"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <Folder className="w-4 h-4 text-accent" />
          <span className="font-medium">{node.name}</span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {node.children?.map(child => (
                <FileNode 
                  key={child.path} 
                  node={child} 
                  level={level + 1} 
                  onSelect={onSelect}
                  selectedPath={selectedPath}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(node.path)}
      className={clsx(
        "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer text-sm transition-colors",
        isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary/50 text-muted-foreground"
      )}
      style={{ paddingLeft: `${level * 12 + 24}px` }}
    >
      <File className="w-4 h-4" />
      <span>{node.name}</span>
    </div>
  );
};

export default function ProjectFiles() {
  const { data: structure, isLoading: loadingStructure } = useProjectStructure();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { data: fileContent, isLoading: loadingFile } = useProjectFile(selectedFile);

  // Helper to determine language for syntax highlighting
  const getLanguage = (path: string) => {
    if (path.endsWith('.py')) return 'python';
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    return 'text';
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Project Files</h1>
          <p className="text-muted-foreground text-sm">Browse the implementation details of the MLOps pipeline.</p>
        </div>
        <button 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            onClick={() => alert("This would download the project zip in a real app.")}
        >
          <Download className="w-4 h-4" />
          Download Code
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 h-full min-h-0">
        {/* File Tree Sidebar */}
        <Card className="col-span-12 md:col-span-4 lg:col-span-3 overflow-hidden flex flex-col h-full border-border/60">
           <div className="p-3 border-b border-border bg-muted/20 font-medium text-xs uppercase tracking-wider text-muted-foreground">
             Explorer
           </div>
           <div className="flex-1 overflow-y-auto p-2">
             {loadingStructure ? (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                 Loading structure...
               </div>
             ) : (
               structure?.map(node => (
                 <FileNode 
                    key={node.path} 
                    node={node} 
                    onSelect={setSelectedFile}
                    selectedPath={selectedFile}
                 />
               ))
             )}
           </div>
        </Card>

        {/* Code Viewer */}
        <Card className="col-span-12 md:col-span-8 lg:col-span-9 overflow-hidden flex flex-col h-full bg-[#1e1e1e] border-none shadow-2xl">
          {selectedFile ? (
            <>
              <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
                <span className="text-sm text-gray-300 font-mono">{selectedFile}</span>
                <span className="text-xs text-gray-500 uppercase">{getLanguage(selectedFile)}</span>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                {loadingFile ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Loading content...
                  </div>
                ) : (
                  <SyntaxHighlighter
                    language={getLanguage(selectedFile)}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '14px', lineHeight: '1.5' }}
                    showLineNumbers
                  >
                    {fileContent?.content || ""}
                  </SyntaxHighlighter>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="p-4 rounded-full bg-white/5">
                <FileText className="w-12 h-12 opacity-50" />
              </div>
              <p>Select a file to view its content</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
