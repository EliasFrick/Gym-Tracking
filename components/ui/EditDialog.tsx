import { IEditPopover } from "@/types/interfaces";
import { X } from "@tamagui/lucide-icons";
import { Dimensions } from "react-native";
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Sheet,
  TooltipSimple,
  Unspaced,
  XStack,
} from "tamagui";

const { width, height } = Dimensions.get("window");

export function EditPopover(props: IEditPopover) {

    return (
      <Dialog
        modal
        open={props.showDeletePopover}
        onOpenChange={props.setShowDeletePopover}
      >
        <Adapt when="sm" platform="touch">
          <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
            <Sheet.Frame padding="$4" gap="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="slow"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quicker",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title>{props.title}</Dialog.Title>
            <Dialog.Description>
            {props.description}
            </Dialog.Description>
            <Fieldset gap="$4" horizontal>
              <Label
                width={width * 0.2}
                justifyContent="flex-end"
                htmlFor="name"
              >
                {props.label}
              </Label>
              <Input flex={1} id="name" defaultValue="Nate Wienert" />
            </Fieldset>
            <XStack justifyContent="space-between" alignItems="center" gap="$4">
              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  theme="active"
                  backgroundColor={"red"}
                  aria-label="Close"
                >
                  {props.deleteButtonTitle}
                </Button>
              </Dialog.Close>
              <Dialog.Close displayWhenAdapted asChild>
                <Button theme="active" aria-label="Close">
                {props.saveButtonTitle}
                </Button>
              </Dialog.Close>
            </XStack>

            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  top="$3"
                  right="$3"
                  size="$2"
                  circular
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    );
  };