import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Component() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" defaultChecked />
                <Label
                  htmlFor="email-notifications"
                  className="text-sm font-medium"
                >
                  Receive email notifications
                </Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <div className="flex items-center space-x-2">
                <Switch id="push-notifications" />
                <Label
                  htmlFor="push-notifications"
                  className="text-sm font-medium"
                >
                  Receive push notifications
                </Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notification-sound">Notification Sound</Label>
              <Select name="notification-sound">
                <SelectTrigger>
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="ding">Ding</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
