import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Save, User } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { profile, setProfile } = useAuth();
  const [displayName, setDisplayName] = useState(
    profile?.display_name || profile?.full_name || "",
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setProfile((prev) =>
      prev ? { ...prev, display_name: displayName, phone } : prev,
    );
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <GlassCard>
        <h2 className="text-lg font-bold text-brand-black mb-6">
          Informações do Perfil
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-gray-200/20">
            <div className="w-14 h-14 rounded-full bg-brand-blue/15 flex items-center justify-center">
              <span className="text-xl font-bold text-brand-blue">
                {(displayName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-brand-black">
                {displayName || "Advogado"}
              </p>
              <p className="text-sm text-brand-gray-400">{profile?.email}</p>
            </div>
          </div>

          <Input
            id="display_name"
            label="Nome de exibição"
            placeholder="Dr. / Dra. + seu nome"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            icon={<User size={18} />}
          />

          <div>
            <label className="block text-sm font-medium text-brand-gray-600 mb-1.5">
              Email
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-gray-200/20 text-sm text-brand-gray-400">
              <Mail size={18} />
              {profile?.email}
            </div>
          </div>

          <Input
            id="phone"
            label="Telefone (opcional)"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button onClick={handleSave} loading={saving}>
            <Save size={16} /> Salvar alterações
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
