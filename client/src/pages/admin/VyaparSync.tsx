import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, FileUp, CheckCircle, AlertCircle, FileSpreadsheet, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
// import { useDropzone } from "react-dropzone"; // Start using native instead
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function VyaparSync() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [importType, setImportType] = useState<"customers" | "products" | "invoices">("invoices");
    const [uploadProgress, setUploadProgress] = useState(0);

    // Upload Mutation
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", importType);

            const res = await apiRequest("POST", "/api/import/upload", formData);
            return await res.json();
        },
        onSuccess: (data) => {
            toast({
                title: "Upload Successful",
                description: `Ready to process ${data.totalRows} rows.`,
            });
            queryClient.invalidateQueries({ queryKey: ["importHistory"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Upload Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    });

    // Sync/Process Mutation
    const syncMutation = useMutation({
        mutationFn: async (importId: string) => {
            const res = await apiRequest("POST", `/api/import/sync/${importId}`);
            return await res.json();
        },
        onSuccess: (data) => {
            toast({
                title: "Sync Complete",
                description: `Processed: ${data.processed}, Errors: ${data.errors || 0}`,
            });
            // Refresh current status view
            queryClient.invalidateQueries({ queryKey: ["importHistory"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Sync Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    });

    // Recent Imports Query
    const { data: recentImports } = useQuery({
        queryKey: ["importHistory"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/import/history");
            return await res.json();
        }
    });

    // Native DnD handlers
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            // Check extension
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
                uploadMutation.mutate(file);
            } else {
                toast({
                    title: "Invalid File",
                    description: "Please upload .xlsx, .xls, or .csv files.",
                    variant: "destructive"
                });
            }
        }
    }, [uploadMutation, toast]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            uploadMutation.mutate(e.target.files[0]);
        }
    };

    if (loading) return null;
    if (!user || user.role !== 'admin') {
        return <Redirect to="/login" />;
    }

    // Find the most recent active import to show status for, or just show list
    const activeImport = recentImports?.[0];

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-display font-bold mb-2">Vyapar Billing Sync</h1>
                        <p className="text-muted-foreground">Seamlessly import your Excel/CSV data to the system.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Upload Area */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-0 shadow-xl rounded-[2rem] bg-white overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-8">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="w-5 h-5 text-primary" />
                                            New Import
                                        </CardTitle>

                                        <Select value={importType} onValueChange={(v: any) => setImportType(v)}>
                                            <SelectTrigger className="w-[180px] bg-white border-slate-200">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="invoices">Sales Invoices</SelectItem>
                                                <SelectItem value="customers">Customers</SelectItem>
                                                <SelectItem value="products">Products / Items</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <CardDescription className="mt-2">Select data type and upload your Vyapar export.</CardDescription>
                                </CardHeader>

                                <CardContent className="p-8">
                                    <div
                                        onDragEnter={handleDragEnter}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('file-upload-sync')?.click()}
                                        className={`
                      border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
                      ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"}
                    `}
                                    >
                                        <input
                                            id="file-upload-sync"
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                        />
                                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            {uploadMutation.isPending ? (
                                                <Loader2 className="w-10 h-10 animate-spin" />
                                            ) : (
                                                <FileSpreadsheet className="w-10 h-10" />
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                                            {isDragActive ? "Drop file here" : "Drag & drop Excel file"}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6">
                                            Supports .xlsx, .xls, .csv. Max 50MB.
                                        </p>

                                        <ShinyButton
                                            className="mx-auto"
                                            disabled={uploadMutation.isPending}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                document.getElementById('file-upload-sync')?.click();
                                            }}
                                        >
                                            Browse Files
                                        </ShinyButton>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status Card for Active Import */}
                            {activeImport && (
                                <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                                    <div className="p-6 flex items-center justify-between bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${activeImport.status === 'processed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {activeImport.status === 'processed' ? <CheckCircle className="w-6 h-6" /> : <RefreshCw className="w-6 h-6 animate-pulse" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{activeImport.filename}</h4>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{activeImport.type} • {activeImport.status}</p>
                                            </div>
                                        </div>

                                        {activeImport.status === 'pending' && (
                                            <ShinyButton
                                                onClick={() => syncMutation.mutate(activeImport.id)}
                                                disabled={syncMutation.isPending}
                                                className="bg-primary text-white"
                                            >
                                                {syncMutation.isPending ? "Syncing..." : "Process Sync"}
                                            </ShinyButton>
                                        )}
                                    </div>

                                    {activeImport.status === 'processed' && (
                                        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white border-t border-slate-100">
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-slate-400 uppercase font-bold">Total</p>
                                                <p className="text-xl font-bold text-slate-800">{activeImport.totalCount}</p>
                                            </div>
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-slate-400 uppercase font-bold">Success</p>
                                                <p className="text-xl font-bold text-green-600">{activeImport.processedCount}</p>
                                            </div>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="p-4 text-center cursor-pointer hover:bg-red-50 transition-colors group">
                                                        <p className="text-xs text-slate-400 uppercase font-bold group-hover:text-red-500">Errors</p>
                                                        <p className="text-xl font-bold text-red-500 underline decoration-dotted underline-offset-4">
                                                            {activeImport.errorLog ? (Array.isArray(activeImport.errorLog) ? activeImport.errorLog.length : JSON.parse(JSON.stringify(activeImport.errorLog)).length) : 0}
                                                        </p>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh]">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-red-600 flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5" />
                                                            Import Errors
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <ScrollArea className="h-[50vh] mt-4 pr-4">
                                                        <div className="space-y-2">
                                                            {activeImport.errorLog && (Array.isArray(activeImport.errorLog) ? activeImport.errorLog : JSON.parse(JSON.stringify(activeImport.errorLog))).map((err: any, idx: number) => (
                                                                <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm flex gap-3">
                                                                    <span className="font-mono font-bold text-red-700 min-w-[80px] shrink-0">
                                                                        {err.row?.toString().startsWith('Row') ? err.row : `Row ${err.row}`}
                                                                    </span>
                                                                    <span className="text-slate-700">{err.error}</span>
                                                                </div>
                                                            ))}
                                                            {!activeImport.errorLog && <p className="text-center text-slate-500 py-8">No errors recorded.</p>}
                                                        </div>
                                                    </ScrollArea>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </Card>
                            )}
                        </div>

                        {/* Right Column: History / Instructions */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-lg rounded-3xl bg-slate-900 text-white p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Instructions
                                </h3>
                                <ul className="space-y-4 text-sm text-slate-300">
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                                        Export your data from Vyapar as "Excel".
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                                        Select the correct type (Customers, Invoices, etc.) above.
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                                        Upload and click "Process Sync" to update the database.
                                    </li>
                                </ul>
                            </Card>

                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4">Recent Imports</h3>
                                <div className="space-y-4">
                                    {recentImports?.slice(0, 5).map((imp: any) => (
                                        <div key={imp.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-700 truncate max-w-[150px]" title={imp.filename}>{imp.filename}</span>
                                                <span className="text-[10px] text-slate-400 uppercase">{imp.type} • {new Date(imp.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${imp.status === 'processed' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {imp.status}
                                            </span>
                                        </div>
                                    ))}
                                    {!recentImports?.length && <p className="text-sm text-slate-400 text-center py-4">No recent imports</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </Layout>
    );
}
