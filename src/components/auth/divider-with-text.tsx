import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import React from 'react'

// Создаем стилизованный div для разделителя с текстом
const DividerWithTextContainer = styled('div')`
  display: flex;
  align-items: center;
  text-align: center;
`

// Стилизованные псевдоэлементы для линий до и после текста
const Divider = styled('div')(({ theme }) => ({
  flexGrow: 1,
  height: 3,
  borderBottom: '2px solid',
  borderColor: theme.palette.grey[300],
  // backgroundColor: theme.palette.grey[300],
}))

const TextWithDivider = styled(Typography)(({ theme }) => ({
  padding: '0 10px',
  color: theme.palette.grey[600],
}))

// Компонент, который использует вышеопределенные стилизованные компоненты
// Добавляем пропсы для компонента
interface DividerWithTextProps {
  text: string
}

const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => (
  <DividerWithTextContainer>
    <Divider />
    <TextWithDivider variant="caption">{text}</TextWithDivider>
    <Divider />
  </DividerWithTextContainer>
)

export default DividerWithText
