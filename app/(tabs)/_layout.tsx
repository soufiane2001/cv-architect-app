import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{
      fontSize: 20,
      opacity: focused ? 1 : 0.45,
    }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.paper,
          borderTopWidth: 1,
          borderTopColor: Colors.rule,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.ink3,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: FontSize.xs,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => <TabIcon label="⌂" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="emploi"
        options={{
          title: 'Conseils',
          tabBarIcon: ({ focused }) => <TabIcon label="✦" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
