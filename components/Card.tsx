import { Shadows } from "@/constants/Shadows"
import useThemeColors from "@/hooks/useThemeColors"
import { type ViewProps, View, ViewStyle } from "react-native"

type Props = ViewProps

export default function Card({style, ...rest}: Props) {
    const colors = useThemeColors()
  return (
    <View style={[ styles, {backgroundColor : colors.grayWhite}, style]} {... rest}/>
  )
}
const styles = {
   
    borderRadius: 8,
    ...Shadows.dp2
} satisfies ViewStyle
