'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ContentSectionProps {
  title: string
  content: string
  icon?: React.ReactNode
  className?: string
}

export default function ContentSection({ title, content, icon, className = '' }: ContentSectionProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="prose prose-sm sm:prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
            {content}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}