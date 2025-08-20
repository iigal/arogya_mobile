import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radius, shadow, text } from '../theme';
import FrostedCard from './FrostedCard';
import { useRouter, Link } from 'expo-router';

type Props = {
  healthCampaign: {
    id: number;
    title: string;
    timing?: string | null;
    location?: string | null;
    helpline?: string | null;
    vaccines?: { id: number; name: string; type?: string | null; age_group?: string | null; timing?: string | null }[];
    medicines?: { id: number; name: string; type?: string | null; age_group?: string | null; description?: string | null; availability?: string | null }[];
  };
  onRegister?: (healthCampaignId: number) => void;
};

export default function CampaignCard({ healthCampaign, onRegister }: Props) {
  const [showServices, setShowServices] = useState(false);
  const router = useRouter();
  return (
    <FrostedCard style={styles.cardOuter}>
      <Text style={styles.title}>{healthCampaign.title}</Text>
      {healthCampaign.timing ? <Text style={styles.meta}>⏰ {healthCampaign.timing}</Text> : null}
      {healthCampaign.location ? <Text style={styles.meta}>📍 {healthCampaign.location}</Text> : null}
      {healthCampaign.helpline ? <Text style={styles.meta}>☎️ {healthCampaign.helpline}</Text> : null}

      {(healthCampaign.vaccines?.length || healthCampaign.medicines?.length) ? (
        <View style={{ marginTop: spacing.sm }}>
          <Pressable onPress={() => setShowServices((v) => !v)} style={({ pressed }) => [styles.toggle, { opacity: pressed ? 0.95 : 1 }] }>
            <Text style={styles.toggleText}>{showServices ? 'Hide' : 'Show'} Services</Text>
          </Pressable>
          {showServices ? (
            <View style={styles.servicesBox}>
              {healthCampaign.vaccines && healthCampaign.vaccines.length > 0 ? (
                <View style={styles.serviceGroup}>
                  <Text style={styles.groupTitle}>Vaccines</Text>
                  {healthCampaign.vaccines.map((v) => (
                    <Text key={`v-${v.id}`} style={styles.serviceItem}>• {v.name}{v.type ? ` (${v.type})` : ''}{v.age_group ? ` • ${v.age_group}` : ''}{v.timing ? ` • ${v.timing}` : ''}</Text>
                  ))}
                </View>
              ) : null}
              {healthCampaign.medicines && healthCampaign.medicines.length > 0 ? (
                <View style={styles.serviceGroup}>
                  <Text style={styles.groupTitle}>Medicines</Text>
                  {healthCampaign.medicines.map((m) => (
                    <Text key={`m-${m.id}`} style={styles.serviceItem}>• {m.name}{m.type ? ` (${m.type})` : ''}{m.age_group ? ` • ${m.age_group}` : ''}{m.availability ? ` • ${m.availability}` : ''}{m.description ? ` — ${m.description}` : ''}</Text>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.row}>
        <Link href={{ pathname: '/healthCampaigns/[id]', params: { id: String(healthCampaign.id) } } as any} asChild>
          <Pressable style={({ pressed }) => [
            styles.btn,
            styles.btnGhost,
            { opacity: pressed ? 0.96 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ] }>
            <Text style={styles.btnGhostText}>View Details</Text>
          </Pressable>
        </Link>
        <Pressable
          onPress={() => onRegister?.(healthCampaign.id)}
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            { opacity: pressed ? 0.96 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Text style={styles.btnPrimaryText}>Register</Text>
        </Pressable>
      </View>
    </FrostedCard>
  );
}

const styles = StyleSheet.create({
  cardOuter: { padding: 0 },
  title: { ...text.title, marginBottom: spacing.xs },
  meta: { ...text.muted, marginTop: spacing.xs },
  toggle: { alignSelf: 'flex-start', marginTop: spacing.xs, backgroundColor: colors.subtle, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  toggleText: { ...text.button },
  servicesBox: { marginTop: spacing.sm, backgroundColor: colors.subtle, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  serviceGroup: { marginTop: spacing.xs },
  groupTitle: { fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  serviceItem: { color: colors.textMuted, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.md },
  btn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { ...text.buttonPrimary },
  btnGhost: { backgroundColor: colors.primarySoft },
  btnGhostText: { ...text.button },
});

