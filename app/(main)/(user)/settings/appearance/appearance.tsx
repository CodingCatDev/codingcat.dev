"use client"
import {
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Appearance() {
  const { setTheme, theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <CardContent>
      {!isClient ? (
        <>Loading...</>
      ) :
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select name="theme" value={theme} onValueChange={(v) => setTheme(v)}>
              <SelectTrigger >
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      }
    </CardContent>
  );
}
