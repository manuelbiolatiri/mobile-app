import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold mb-4">Tab Two</Text>
      <View className="h-[1px] w-4/5 bg-gray-200 dark:bg-gray-800 my-8" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
