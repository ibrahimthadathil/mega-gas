'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface AutocompleteProps<T> {
  items: T[]
  value?: T | null
  onChange?: (value: T | null) => void

  getLabel: (item: T) => string
  filterFn?: (item: T, query: string) => boolean
  renderItem?: (item: T) => React.ReactNode

  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function Autocomplete<T>({
  items,
  value = null,
  onChange,
  getLabel,
  filterFn,
  renderItem,
  placeholder = 'Search...',
  disabled = false,
  className = '',
}: AutocompleteProps<T>) {
  const [ query, setQuery] = useState(() => value ? getLabel(value) : '')
  const [debouncedQuery] = useDebounce(query, 300)
  const [suggestions, setSuggestions] = useState<T[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)

  useEffect(() => {
    if (value) {
      const label = getLabel(value)
      setQuery(label)
      setHasSelected(true)
    } else if (!isFocused && !hasSelected) {
      // Only clear query when not focused, value is null, and nothing was selected
      setQuery('')
    }
  }, [value, getLabel, isFocused, hasSelected])

  const fetchSuggestions = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setSuggestions([])
        return
      }

      const filtered = filterFn
        ? items.filter(item => filterFn(item, q))
        : items.filter(item =>
            getLabel(item).toLowerCase().includes(q.toLowerCase())
          )

      setSuggestions(filtered)
    },
    [items, filterFn, getLabel]
  )

  useEffect(() => {
    if (debouncedQuery && isFocused) fetchSuggestions(debouncedQuery)
    else setSuggestions([])
  }, [debouncedQuery, isFocused, fetchSuggestions])

  const handleSelect = (item: T) => {
    const label = getLabel(item)
    setQuery(label)
    setHasSelected(true)
    onChange?.(item)
    setSuggestions([])
    setSelectedIndex(-1)
    setIsFocused(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setSelectedIndex(-1)
    setHasSelected(false)

    // Only clear selection if input is completely empty
    if (!val.trim()) {
      onChange?.(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setSelectedIndex(-1)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          value={query}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true)
            // If we have a value, show suggestions when focused
            if (value && query) {
              fetchSuggestions(query)
            }
          }}
          onBlur={() =>
            setTimeout(() => {
              setIsFocused(false)
              setSuggestions([])
              setSelectedIndex(-1)
              // Restore the selected value label if we have one
              if (value) {
                setQuery(getLabel(value))
                setHasSelected(true)
              }
            }, 200)
          }
          disabled={disabled}
          className="pr-10"
        />

        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
          tabIndex={-1}
          disabled={disabled}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {suggestions.length > 0 && isFocused && !disabled && (
        <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-md border bg-background shadow">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className={`cursor-pointer px-4 py-2 hover:bg-muted ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
            >
              {renderItem ? renderItem(item) : getLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
