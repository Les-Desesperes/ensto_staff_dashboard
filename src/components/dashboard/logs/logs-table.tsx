"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Filter, Search, ShieldAlert, DoorOpen, DoorClosed, Hand } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 1. Types adaptés à la table Historique_Log de ENSTO
type ActionType = "Entrée" | "Sortie" | "Refus" | "Ouverture_Manuelle";
type EntityType = "Livreur" | "Visiteur" | "Personnel" | "Véhicule";

interface AccessLog {
    id: string;
    timestamp: string;
    action: ActionType;
    entityType: EntityType;
    entityName: string; // Ex: "Jean Dupont" ou "Plaque AB-123-CD"
    message: string;
    tags: string[];
}

type Filters = {
    action: string[];
    entityType: string[];
};

// 2. Données factices réalistes pour ton jury
const SAMPLE_LOGS: AccessLog[] = [
    {
        id: "1",
        timestamp: "2024-03-18T08:32:45Z",
        action: "Entrée",
        entityType: "Livreur",
        entityName: "Jean Dupont",
        message: "Accès autorisé - Lecture de plaque confirmée",
        tags: ["Camion", "DHL"],
    },
    {
        id: "2",
        timestamp: "2024-03-18T08:45:12Z",
        action: "Refus",
        entityType: "Visiteur",
        entityName: "Inconnu",
        message: "Accès refusé - Interphone sans réponse",
        tags: ["Piéton", "Sécurité"],
    },
    {
        id: "3",
        timestamp: "2024-03-18T09:15:00Z",
        action: "Ouverture_Manuelle",
        entityType: "Personnel",
        entityName: "Admin ENSTO",
        message: "Ouverture barrière forcée depuis le dashboard",
        tags: ["Dashboard", "Admin"],
    },
    {
        id: "4",
        timestamp: "2024-03-18T09:30:22Z",
        action: "Sortie",
        entityType: "Livreur",
        entityName: "Jean Dupont",
        message: "Départ du site - Bon de livraison signé",
        tags: ["Camion", "DHL"],
    },
    {
        id: "5",
        timestamp: "2024-03-18T10:05:10Z",
        action: "Refus",
        entityType: "Livreur",
        entityName: "Marc Leroy",
        message: "Accès refusé - Charte EPI non valide",
        tags: ["Camion", "Chronopost", "EPI"],
    },
    {
        id: "6",
        timestamp: "2024-03-18T10:10:05Z",
        action: "Entrée",
        entityType: "Visiteur",
        entityName: "Sophie Martin",
        message: "Accès autorisé - RDV Direction",
        tags: ["Véhicule Léger"],
    },
];

// 3. Styles adaptés aux actions physiques
const actionStyles: Record<ActionType, string> = {
    "Entrée": "bg-green-500/10 text-green-700 dark:text-green-400",
    "Sortie": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    "Refus": "bg-red-500/10 text-red-700 dark:text-red-400",
    "Ouverture_Manuelle": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

// Icônes dynamiques
const ActionIcon = ({ action }: { action: ActionType }) => {
    switch (action) {
        case "Entrée": return <DoorOpen className="size-4" />;
        case "Sortie": return <DoorClosed className="size-4" />;
        case "Refus": return <Hand className="size-4" />;
        case "Ouverture_Manuelle": return <ShieldAlert className="size-4" />;
    }
};

function LogRow({ log, expanded, onToggle }: { log: AccessLog; expanded: boolean; onToggle: () => void; }) {
    const formattedTime = new Date(log.timestamp).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <>
            <motion.button
                onClick={onToggle}
                className="w-full p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted/70 border-b border-border/50"
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            >
                <div className="flex items-center gap-4">
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>

                    <Badge variant="secondary" className={`flex flex-shrink-0 items-center gap-1.5 w-32 justify-center capitalize ${actionStyles[log.action]}`}>
                        <ActionIcon action={log.action} />
                        {log.action.replace("_", " ")}
                    </Badge>

                    <time className="w-20 flex-shrink-0 font-mono text-xs text-muted-foreground">
                        {formattedTime}
                    </time>

                    <Badge variant="outline" className="flex-shrink-0 w-24 justify-center">
                        {log.entityType}
                    </Badge>

                    <span className="flex-shrink-0 w-32 text-sm font-medium text-foreground truncate">
                        {log.entityName}
                    </span>

                    <p className="flex-1 truncate text-sm text-muted-foreground">
                        {log.message}
                    </p>
                </div>
            </motion.button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-muted/30"
                    >
                        <div className="space-y-4 p-4 pl-12">
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Détails de l'événement</p>
                                <p className="rounded-md border bg-background p-3 text-sm text-foreground">
                                    {log.message}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Horodatage Complet</p>
                                    <p className="font-mono text-xs text-foreground">
                                        {new Date(log.timestamp).toLocaleString("fr-FR")}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID Enregistrement (BDD)</p>
                                    <p className="font-mono text-xs text-foreground">
                                        #LOG-{log.id.padStart(6, '0')}
                                    </p>
                                </div>
                            </div>

                            {log.tags.length > 0 && (
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mots-clés associés</p>
                                    <div className="flex flex-wrap gap-2">
                                        {log.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function FilterPanel({ filters, onChange, logs }: { filters: Filters; onChange: (filters: Filters) => void; logs: AccessLog[]; }) {
    const actions = Array.from(new Set(logs.map((log) => log.action)));
    const entityTypes = Array.from(new Set(logs.map((log) => log.entityType)));

    const toggleFilter = (category: keyof Filters, value: string) => {
        const current = filters[category];
        const updated = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
        onChange({ ...filters, [category]: updated });
    };

    const clearAll = () => onChange({ action: [], entityType: [] });
    const hasActiveFilters = Object.values(filters).some((group) => group.length > 0);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.05 }}
            className="flex h-full flex-col space-y-6 overflow-y-auto bg-card p-4 border-l"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Filtres</h3>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 text-xs text-muted-foreground">
                        Réinitialiser
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type d'Action</p>
                <div className="space-y-2">
                    {actions.map((action) => {
                        const selected = filters.action.includes(action);
                        return (
                            <motion.button
                                key={action} type="button" whileHover={{ x: 2 }} onClick={() => toggleFilter("action", action)}
                                className={`flex w-full items-center justify-between gap-2 border rounded-md px-3 py-2 text-sm transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/40"}`}
                            >
                                <span className="capitalize">{action.replace("_", " ")}</span>
                                {selected && <Check className="h-3.5 w-3.5" />}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Catégorie</p>
                <div className="space-y-2">
                    {entityTypes.map((type) => {
                        const selected = filters.entityType.includes(type);
                        return (
                            <motion.button
                                key={type} type="button" whileHover={{ x: 2 }} onClick={() => toggleFilter("entityType", type)}
                                className={`flex w-full items-center justify-between gap-2 border rounded-md px-3 py-2 text-sm transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/40"}`}
                            >
                                <span>{type}</span>
                                {selected && <Check className="h-3.5 w-3.5" />}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export function InteractiveLogsTable() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({ action: [], entityType: [] });

    const filteredLogs = useMemo(() => {
        return SAMPLE_LOGS.filter((log) => {
            const lowerQuery = searchQuery.toLowerCase();
            const matchSearch = log.message.toLowerCase().includes(lowerQuery) || log.entityName.toLowerCase().includes(lowerQuery);
            const matchAction = filters.action.length === 0 || filters.action.includes(log.action);
            const matchEntityType = filters.entityType.length === 0 || filters.entityType.includes(log.entityType);

            return matchSearch && matchAction && matchEntityType;
        });
    }, [filters, searchQuery]);

    const activeFilters = filters.action.length + filters.entityType.length;

    return (
        <div className="flex flex-col h-[700px] w-full bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="border-b border-border p-4 bg-muted/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-foreground">Journaux d'accès</h3>
                        <p className="text-sm text-muted-foreground">
                            {filteredLogs.length} événement(s) trouvé(s) sur {SAMPLE_LOGS.length}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un nom ou détail..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="h-9 pl-9 text-sm bg-background"
                            />
                        </div>
                        <Button
                            variant={showFilters ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowFilters((current) => !current)}
                            className="relative h-9 bg-background"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filtres
                            {activeFilters > 0 && (
                                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                                    {activeFilters}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col">
                        <AnimatePresence mode="popLayout">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log, index) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, delay: index * 0.02 }}
                                    >
                                        <LogRow
                                            log={log}
                                            expanded={expandedId === log.id}
                                            onToggle={() => setExpandedId((current) => current === log.id ? null : log.id)}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
                                    <p className="text-muted-foreground">Aucun événement ne correspond à vos filtres.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {showFilters && (
                        <motion.div
                            key="filters"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-l border-border bg-card absolute right-0 h-full z-10 shadow-xl sm:relative sm:shadow-none"
                        >
                            <FilterPanel filters={filters} onChange={setFilters} logs={SAMPLE_LOGS} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}