import React from 'react';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View className="items-center mx-12">
        <Text
          className="text-lg leading-6 text-center text-gray-800 dark:text-gray-200"
        >
          Open up the code for this screen:
        </Text>

        <View
          className="bg-gray-100 dark:bg-gray-900 rounded px-4 my-2"
        >
          <MonoText>{path}</MonoText>
        </View>

        <Text
          className="text-lg leading-6 text-center text-gray-800 dark:text-gray-200"
        >
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View className="mt-4 mx-5 items-center">
        <ExternalLink
          className="py-4"
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text className="text-center text-blue-500">
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}
