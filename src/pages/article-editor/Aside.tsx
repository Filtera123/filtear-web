import { useState } from 'react';
import { Button, HStack, Switch, VStack } from '@chakra-ui/react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip } from '@/components';

const Aside = () => {
  const [checked, setChecked] = useState(true);

  return (
    <VStack className="p-4 bg-white rounded-sm h-[calc(100vh-4.5rem)] overflow-y-auto items-start">
      <HStack>
        <Switch.Root checked={checked} onCheckedChange={(e) => setChecked(e.checked)}>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>自动保存</Switch.Label>
        </Switch.Root>
        <Tooltip
          content="默认每隔5分钟保存一次"
          openDelay={100}
          positioning={{
            placement: 'top',
          }}
        >
          <IconInfoCircle />
        </Tooltip>
      </HStack>
      <Button className="w-full">设置</Button>
      <Button className="w-full">预览</Button>
      <Button className="w-full">历史记录</Button>
      <Button className="w-full">保存</Button>
      <Button className="w-full">发布</Button>
    </VStack>
  );
};

export default Aside;
