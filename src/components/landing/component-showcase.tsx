import {
  Bell,
  CheckCircle2,
  CircleAlert,
  Layers3,
  Sparkles
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/providers/use-i18n";

export function ComponentShowcase() {
  const { t } = useI18n();

  return (
    <section id="component-showcase" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-border/70 bg-card/70 p-6 shadow-[0_24px_120px_rgba(16,24,40,0.08)] sm:p-8">
        <div className="max-w-3xl">
          <Badge variant="accent">{t("landing.componentTitle")}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {t("components.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {t("landing.componentBody")}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-border/70 bg-secondary/55">
            <CardHeader>
              <CardTitle>{t("components.tokensTitle")}</CardTitle>
              <CardDescription>{t("components.body")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge>Starter</Badge>
                <Badge variant="outline">Vite SPA</Badge>
                <Badge variant="accent">shadcn/ui</Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button>{t("components.primaryButton")}</Button>
                <Button variant="secondary">
                  {t("components.secondaryButton")}
                </Button>
                <Button variant="outline">
                  {t("components.outlineButton")}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between rounded-[1.5rem] border border-border/70 bg-background/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">
                      {t("components.preferenceRowTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("components.preferenceRowBody")}
                    </p>
                  </div>
                </div>
                <Switch checked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-background/80">
            <CardHeader>
              <CardTitle>{t("components.actionsTitle")}</CardTitle>
              <CardDescription>{t("components.surfacesTitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signals">
                <TabsList>
                  <TabsTrigger value="signals">
                    {t("components.tabSignals")}
                  </TabsTrigger>
                  <TabsTrigger value="surfaces">
                    {t("components.tabSurfaces")}
                  </TabsTrigger>
                  <TabsTrigger value="states">
                    {t("components.tabStates")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="signals"
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  <ShowcaseTile
                    icon={Sparkles}
                    text={t("components.signalHero")}
                  />
                  <ShowcaseTile
                    icon={Layers3}
                    text={t("components.signalLayout")}
                  />
                </TabsContent>
                <TabsContent
                  value="surfaces"
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  <ShowcaseTile
                    icon={CheckCircle2}
                    text={t("components.surfaceHeader")}
                  />
                  <ShowcaseTile
                    icon={Bell}
                    text={t("components.surfaceProtected")}
                  />
                </TabsContent>
                <TabsContent
                  value="states"
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  <ShowcaseTile
                    icon={CheckCircle2}
                    text={t("components.stateAuth")}
                  />
                  <ShowcaseTile
                    icon={Sparkles}
                    text={t("components.stateLocale")}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-border/70 bg-background/82">
            <CardHeader>
              <Badge variant="outline">{t("components.officialTitle")}</Badge>
              <CardTitle>{t("components.accordionTitle")}</CardTitle>
              <CardDescription>{t("components.accordionBody")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion className="w-full" collapsible type="single">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    {t("components.accordionItemOne")}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t("components.accordionItemOneBody")}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    {t("components.accordionItemTwo")}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t("components.accordionItemTwoBody")}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    {t("components.accordionItemThree")}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t("components.accordionItemThreeBody")}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-secondary/40">
            <CardHeader>
              <CardTitle>{t("components.alertTitle")}</CardTitle>
              <CardDescription>{t("components.alertBody")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>{t("components.alertSuccessTitle")}</AlertTitle>
                <AlertDescription>
                  {t("components.alertSuccessBody")}
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>{t("components.alertWarningTitle")}</AlertTitle>
                <AlertDescription>
                  {t("components.alertWarningBody")}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5">
          <Card className="border-border/70 bg-background/82">
            <CardHeader>
              <Badge variant="outline">{t("components.officialTitle")}</Badge>
              <CardTitle>{t("components.tableTitle")}</CardTitle>
              <CardDescription>{t("components.tableBody")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>{t("components.tableCaption")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("components.tableColName")}</TableHead>
                    <TableHead>{t("components.tableColStatus")}</TableHead>
                    <TableHead>{t("components.tableColLayer")}</TableHead>
                    <TableHead>{t("components.tableColNote")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("components.tableRowRouting")}</TableCell>
                    <TableCell>{t("components.tableStateReady")}</TableCell>
                    <TableCell>{t("components.tableLayerApp")}</TableCell>
                    <TableCell>{t("components.tableNoteRouting")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t("components.tableRowTheme")}</TableCell>
                    <TableCell>{t("components.tableStateReady")}</TableCell>
                    <TableCell>{t("components.tableLayerUX")}</TableCell>
                    <TableCell>{t("components.tableNoteTheme")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t("components.tableRowI18n")}</TableCell>
                    <TableCell>{t("components.tableStateReady")}</TableCell>
                    <TableCell>{t("components.tableLayerInfra")}</TableCell>
                    <TableCell>{t("components.tableNoteI18n")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t("components.tableRowAuth")}</TableCell>
                    <TableCell>{t("components.tableStateReady")}</TableCell>
                    <TableCell>{t("components.tableLayerAccess")}</TableCell>
                    <TableCell>{t("components.tableNoteAuth")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-border/70 bg-secondary/40">
            <CardHeader>
              <Badge variant="outline">{t("components.officialTitle")}</Badge>
              <CardTitle>{t("components.checkboxTitle")}</CardTitle>
              <CardDescription>{t("components.checkboxBody")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CheckboxRow label={t("components.checkboxOne")} checked />
              <CheckboxRow label={t("components.checkboxTwo")} />
              <CheckboxRow label={t("components.checkboxThree")} checked />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-background/82">
            <CardHeader>
              <Badge variant="outline">{t("components.officialTitle")}</Badge>
              <CardTitle>{t("components.progressTitle")}</CardTitle>
              <CardDescription>{t("components.progressBody")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ProgressRow label={t("components.progressDesign")} value={72} />
              <ProgressRow label={t("components.progressApp")} value={64} />
              <ProgressRow label={t("components.progressData")} value={18} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ShowcaseTile({
  icon: Icon,
  text
}: {
  icon: typeof Sparkles;
  text: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-muted/60 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-sm font-medium text-foreground">{text}</p>
    </div>
  );
}

function CheckboxRow({
  label,
  checked = false
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-[1.4rem] border border-border/70 bg-background/70 px-4 py-3 text-sm font-medium text-foreground">
      <Checkbox checked={checked} />
      <span>{label}</span>
    </label>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
