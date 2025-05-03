import { HassBlocksEvent } from '../types/index.ts';
import { Box, Text } from 'ink';

interface StaticLogLineProps {
  event: HassBlocksEvent;
}

const getIcon = (event: HassBlocksEvent) => {
  if ('status' in event) {
    switch (event.status) {
      case 'error':
        return '🚨';

      case 'aborted':
        return '🛑';

      case 'started':
        return '🚀';

      case 'finished':
        return '🏁';

      case 'pending':
        return '⌛';

      case 'registered':
        return '✅';
    }
  }
  return '';
};

export const StaticLogLine = ({ event }: StaticLogLineProps) => {
  return (
    <Box flexDirection="row" width="100%">
      <Box width={4}>
        <Text>{getIcon(event)}</Text>
      </Box>
      <Box width={12}>
        <Text>{event.eventType}</Text>
      </Box>

      <Box width={35}>
        <Text>{'parent' in event && event.parent?.name}</Text>
      </Box>
      <Box width={40}>
        <Text>{'name' in event && event.name}</Text>
      </Box>
      <Box>
        <Text>{'triggerId' in event && event.triggerId}</Text>
      </Box>
    </Box>
  );
};
