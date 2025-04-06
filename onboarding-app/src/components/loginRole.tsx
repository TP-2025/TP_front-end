"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DropdownRoleProps = {
    role: string
    setRole: (role: string) => void
}

export function DropdownRole({ role, setRole }: DropdownRoleProps) {
    const isDefault = role === "choose role"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center justify-between w-full gap-2">
          <span className={isDefault ? "text-muted-foreground font-normal" : "text-foreground"}>
            {isDefault ? "Choose Role" : role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full z-50" side="bottom" align="start" sideOffset={4}>
                <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                    <DropdownMenuRadioItem value="doktor">Doktor</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="pacient">Pacient</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="moderator">Moderator</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
