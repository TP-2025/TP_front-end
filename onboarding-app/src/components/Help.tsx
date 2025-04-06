import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"
import { i18n } from "../lib/i18n"

interface HelpProps {
    lang: "sk" | "en"   //Určuje použitý jazyk
}

export function Help({ lang }: HelpProps) {
    const t = i18n[lang].Help //načíta preklad textov pre dany jazyk
    const title = i18n[lang].helpTitle //nacitanie titulok pre dany jazyk

    // Funkcia na zvýraznenie prvého slova v texte
    const highlightFirstWord = (text: string) => {
        const parts = text.split(":");
        return (
            <span>
                <span className="font-bold">{parts[0]}:</span> {parts.slice(1).join(":")}
            </span> /* Zvýrazníme prvé slovo pred dvojbodkou pomocou triedy "font-bold" */ /* Zvyšok textu po dvojbodke zobrazíme normálne */
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="w-20 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-md"
                >
                    {title.split(" ")[0]}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground space-y-1 [&>*:nth-child(2)]:mt-6 [&>*:nth-child(3)]:mt-1 [&>*:nth-child(4)]:mt-6 [&>*:nth-child(5)]:mt-1 [&>*:nth-child(6)]:mt-6">
                    <div>{highlightFirstWord(t.role)}</div>
                    <div>{highlightFirstWord(t.email)}</div>
                    <div>{t.emailNote}</div>
                    <div>{highlightFirstWord(t.password)}</div>
                    <div>{t.passwordNote}</div>
                    <div>{highlightFirstWord(t.login)}</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
