'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface PersonalizationStepProps {
  onComplete: (data: PersonalizationData) => void
  onSkip: () => void
}

export interface PersonalizationData {
  hasChildren: boolean
  childrenCount: number
  childrenAges: number[]
  custodyArrangement: string
  preferredFocus: string[]
}

export default function PersonalizationStep({ onComplete, onSkip }: PersonalizationStepProps) {
  const [hasChildren, setHasChildren] = useState<boolean | null>(null)
  const [childrenCount, setChildrenCount] = useState(0)
  const [childrenAges, setChildrenAges] = useState<number[]>([])
  const [custodyArrangement, setCustodyArrangement] = useState('')
  const [preferredFocus, setPreferredFocus] = useState<string[]>([])

  const handleChildrenCountChange = (count: number) => {
    setChildrenCount(count)
    setChildrenAges(Array(count).fill(0))
  }

  const handleAgeChange = (index: number, age: number) => {
    const newAges = [...childrenAges]
    newAges[index] = age
    setChildrenAges(newAges)
  }

  const handleFocusChange = (focus: string, checked: boolean) => {
    if (checked) {
      setPreferredFocus([...preferredFocus, focus])
    } else {
      setPreferredFocus(preferredFocus.filter(f => f !== focus))
    }
  }

  const handleComplete = () => {
    onComplete({
      hasChildren: hasChildren || false,
      childrenCount,
      childrenAges,
      custodyArrangement,
      preferredFocus
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personalize Your Experience</CardTitle>
        <p className="text-gray-600">Help us provide more relevant support and affirmations</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Do you have children with your narcissistic ex-partner?</Label>
          <RadioGroup value={hasChildren?.toString()} onValueChange={(value) => setHasChildren(value === 'true')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="has-children-yes" />
              <Label htmlFor="has-children-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="has-children-no" />
              <Label htmlFor="has-children-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {hasChildren && (
          <>
            <div>
              <Label className="text-base font-medium">How many children do you have together?</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={childrenCount || ''}
                onChange={(e) => handleChildrenCountChange(parseInt(e.target.value) || 0)}
                className="w-20 mt-2"
              />
            </div>

            {childrenCount > 0 && (
              <div>
                <Label className="text-base font-medium">Children's ages</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {Array(childrenCount).fill(0).map((_, index) => (
                    <Input
                      key={index}
                      type="number"
                      min="0"
                      max="25"
                      placeholder={`Child ${index + 1} age`}
                      value={childrenAges[index] || ''}
                      onChange={(e) => handleAgeChange(index, parseInt(e.target.value) || 0)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-base font-medium">Current custody arrangement</Label>
              <RadioGroup value={custodyArrangement} onValueChange={setCustodyArrangement}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="custody-full" />
                  <Label htmlFor="custody-full">Full custody</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shared" id="custody-shared" />
                  <Label htmlFor="custody-shared">Shared custody</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="custody-limited" />
                  <Label htmlFor="custody-limited">Limited visitation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="supervised" id="custody-supervised" />
                  <Label htmlFor="custody-supervised">Supervised visitation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="custody-none" />
                  <Label htmlFor="custody-none">No contact/custody</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}

        <div>
          <Label className="text-base font-medium">What areas would you like to focus on? (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[
              { id: 'children', label: "Children's wellbeing" },
              { id: 'healing', label: 'Personal healing' },
              { id: 'boundaries', label: 'Setting boundaries' },
              { id: 'strength', label: 'Building strength' },
              { id: 'clarity', label: 'Mental clarity' },
              { id: 'peace', label: 'Inner peace' }
            ].map((focus) => (
              <div key={focus.id} className="flex items-center space-x-2">
                <Checkbox
                  id={focus.id}
                  checked={preferredFocus.includes(focus.id)}
                  onCheckedChange={(checked) => handleFocusChange(focus.id, checked as boolean)}
                />
                <Label htmlFor={focus.id}>{focus.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleComplete} className="flex-1">
            Complete Setup
          </Button>
          <Button variant="outline" onClick={onSkip}>
            Skip for now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}