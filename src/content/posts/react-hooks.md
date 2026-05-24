---
title: React Hooks 入门笔记
date: 2026-05-20
tags: [React, 前端, 教程]
excerpt: 记录 React 常用 Hooks 的使用方法和注意事项。
---

# React Hooks 入门笔记

## useState

最基础的 Hook，用于在函数组件中管理状态：

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

## useEffect

用于处理副作用，比如数据请求、订阅、DOM 操作：

```tsx
import { useEffect, useState } from 'react'

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser)
  }, [userId]) // userId 变化时重新请求

  // ...
}
```

## useMemo 和 useCallback

- **useMemo**：缓存计算结果，避免重复计算
- **useCallback**：缓存函数引用，避免子组件不必要的重渲染

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

const handleClick = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

## 自定义 Hook

把可复用的逻辑抽成自定义 Hook：

```tsx
function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

## 总结

Hooks 让函数组件拥有了状态管理和生命周期能力，写起来比 Class 组件更简洁直观。
