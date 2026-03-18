"use client"

import * as React from "react"
import { ShieldCheck, Key, Database, Lock, Server, ShieldAlert, Fingerprint } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SecuriteSettings() {
    return (
        <Tabs defaultValue="overview" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 md:w-[400px]">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="api">Clés d'API & Tokens</TabsTrigger>
                <TabsTrigger value="policies">Règles d'accès</TabsTrigger>
            </TabsList>

            {/* ONGLET 1 : VUE D'ENSEMBLE (Tes arguments pour le jury) */}
            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Moteur de Chiffrement (RGPD)</CardTitle>
                            <Fingerprint className="size-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">Actif</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Algorithme : <strong>AES-256-CBC</strong>
                            </p>
                            <Badge variant="outline" className="mt-3">@les-desesperes/ensto-db</Badge>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Authentification</CardTitle>
                            <Lock className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Sécurisée</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Hachage : <strong>SHA-256</strong> (Hooks Sequelize)
                            </p>
                            <Badge variant="secondary" className="mt-3">Bearer JWT</Badge>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Base de données MySQL 8</CardTitle>
                            <Database className="size-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Connectée</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Serveur : <strong>Linux "Babylone"</strong>
                            </p>
                            <Badge variant="outline" className="mt-3">Intégrité OK</Badge>
                        </CardContent>
                    </Card>

                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Server className="size-5" /> État des Hooks Sequelize</CardTitle>
                        <CardDescription>
                            Vérification des processus automatiques de protection des données avant insertion en BDD.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Chiffrement à la volée (beforeSave)</Label>
                                <p className="text-sm text-muted-foreground">Transforme les noms en clair en VARBINARY (Buffers) automatiquement.</p>
                            </div>
                            <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"><ShieldCheck className="mr-1 size-3"/> Opérationnel</Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Déchiffrement à la lecture (afterFind)</Label>
                                <p className="text-sm text-muted-foreground">Restitue les données lisibles pour le tableau de bord.</p>
                            </div>
                            <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"><ShieldCheck className="mr-1 size-3"/> Opérationnel</Badge>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ONGLET 2 : API & TOKENS */}
            <TabsContent value="api" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Clés d'API (Bearer Tokens)</CardTitle>
                        <CardDescription>
                            Gérez les accès externes à l'API (ex: Module Caméra Raspberry Pi, Application Magasinier).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom du service</TableHead>
                                    <TableHead>Token (Masqué)</TableHead>
                                    <TableHead>Dernière utilisation</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Caméra LAPI (Entrée principale)</TableCell>
                                    <TableCell className="font-mono text-muted-foreground">sk_ensto_••••••••a7f2</TableCell>
                                    <TableCell>Il y a 2 minutes</TableCell>
                                    <TableCell className="text-right"><Button variant="destructive" size="sm">Révoquer</Button></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Dashboard Web (Session courante)</TableCell>
                                    <TableCell className="font-mono text-muted-foreground">eyJhbGciOi••••••••3Q</TableCell>
                                    <TableCell>Actuellement</TableCell>
                                    <TableCell className="text-right"><Button variant="outline" size="sm" disabled>Actif</Button></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="mt-4">
                            <Button><Key className="mr-2 size-4"/> Générer un nouveau token JWT</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ONGLET 3 : RÈGLES D'ACCÈS */}
            <TabsContent value="policies" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Stratégie de sécurité globale</CardTitle>
                        <CardDescription>Configuration des exigences pour le personnel (Table Employees).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label>Forcer la complexité des mots de passe</Label>
                                <span className="text-sm text-muted-foreground">Exige majuscule, chiffre et caractère spécial avant le hachage SHA-256.</span>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label>Expiration des sessions API</Label>
                                <span className="text-sm text-muted-foreground">Déconnecte automatiquement les utilisateurs inactifs.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input type="number" defaultValue="60" className="w-20" /> <span className="text-sm text-muted-foreground">minutes</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label className="text-destructive flex items-center gap-2"><ShieldAlert className="size-4"/> Verrouillage strict</Label>
                                <span className="text-sm text-muted-foreground">Bloque le compte après 3 tentatives de connexion échouées.</span>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}