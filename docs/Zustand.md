# Zustand

## Concept

---

<aside>
💡 발행/구독 모델. 스토어의 상태 변경이 일어날 때 실행할 리스너 함수를 모아두었다가(구독) 상태가 변경되었을 때 등록된 리스너들에게 상태가 변경되었다고 알려준다.(발행)

</aside>

- 상태를 정의하고 사용하는 것이 매우 쉽다. (러닝커브가 거의 없다)
- Redux의 비해 boilerplate 코드가 적다. → RTK를 통해 많이 줄었지만 그것보다 더 적다.
- 불필요한 리렌더링를 제어하기 쉽다.
- 가볍다 954B (redux: 1.6KB / recoil 22.9KB)
- 특정 라이브러리에 엮이지 않는다.
- 한 개의 중앙에 집중된 형식의 스토어 구조를 활용하면서, 상태를 정의하고 사용하는 방법이 단순하다.
- Context API를 사용할 때와 달리 상태 변경 시 불필요한 리랜더링을 일으키지 않도록 제어하기 쉽다
- React에 직접적으로 의존하지 않기 때문에 자주 바뀌는 상태를 직접 제어할 수 있는 방법도 제공(Transient Update)
- 코드 양이 아주 적다.(핵심 로직의 코드 줄 수 가 약 42줄 밖에 안된다.)

## Core

---

<aside>
💡 발행/구독 모델(Publish-Subscribe)

</aside>

[Zustand Core](https://www.notion.so/Zustand-Core-ee91ff1a57994a6fa549b7bdab48f920) 


## How to Use
```tsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```

---

```tsx
import create from 'zustand';

const useStore = create(set => ({
	// highlight-next-line
	bears: 0,
	increasePopulation: () => set(state => ({bears: state.bears + 1})),
	removeAllBears: () => set({bears: 0})
}))

//사용
// 셀럭터 함수를 전달하지 않으면 전체 스토어가 return 된다!
function BearCounter() {
	//상태를 꺼낸다.
	const bears = useStore(state=> state.bears);

	// 액션을 꺼낸다.
	const increasePopulation = useStore(state => state.increasePopulation);

	return ...
}

```

```tsx
interface AgoraUser extends Partial<ChannelUser> {
	user: IAgoraRTCRemoteUser
	sharing?: boolean
}
interface AgoraState extends State {
	channelId: string
	userMap: { [key: UID]: AgoraUser }
	localUid: UID
	shareUid: UID
	hostUid: UID
	networkQuality: NetworkQuality
	addUser: (user: IAgoraRTCRemoteUser) => void
	setUserInfo: (uid: UID, info: ChannelUser) => void
	setSharing: (uid: UID, sharing: boolean) => void
	deleteUser: (uid: UID) => void
	join: (appId: string) => Promise<void>
	leave: (audioTrack?: ILocalAudioTrack) => Promise<void>
}
// Log every time state is changed
const log = (config) => (set, get, api) =>
	config(
		(args) => {
			if (window?.location?.hostname === "sp.local.hogangnono.com") {
				console.log("  applying", args)
				set(args)
				console.log("  new state", get())
			} else {
				set(args)
			}
		},
		get,
		api
	)

// TODO immer middleware 사용하자!!
export const useAgoraStore = create<AgoraState>(
	log((set, get) => ({
		channelId: "",
		userMap: {},
		localUid: "",
		shareUid: "",
		hostUid: "",
		networkQuality: {
			uplinkNetworkQuality: 0,
			downlinkNetworkQuality: 0,
		},
		addUser: (user) => set((state) => ({ userMap: { ...state.userMap, [user.uid]: { user } } })),
		setUserInfo: (uid, info) =>
			set((state) => ({ userMap: { ...state.userMap, [uid]: { ...state.userMap[uid], ...info } } })),
		setSharing: (uid, sharing) =>
			set((state) => ({ userMap: { ...state.userMap, [uid]: { ...state.userMap[uid], sharing } } })),
		deleteUser: (uid) =>
			set((state) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { [uid]: delKey, ...rest } = state.userMap
				return { userMap: rest }
			}),
		join: async (appId) => {
			const uid = await join(appId, get().channelId)
			set({ localUid: uid })
		},
		leave: async (audioTrack) => {
			await leave(String(get().localUid), get().channelId, audioTrack)
			set({ localUid: "" })
		},
	}))
)

export const isSharingSelector = (state: AgoraState) => state.userMap[state.shareUid]?.sharing
export const joinSelector = (state: AgoraState) => state.join
export const leaveSelector = (state: AgoraState) => state.leave
export const addUserSelector = (state: AgoraState) => state.addUser
export const setUserInfoSelector = (state: AgoraState) => state.setUserInfo
export const setSharingSelector = (state: AgoraState) => state.setSharing
export const deleteUserSelector = (state: AgoraState) => state.deleteUser
export const networkSelector = (state: AgoraState) => state.networkQuality
export const shareUserSelector = (state: AgoraState) => state.userMap[state.shareUid]
export const localUserSelector = (state: AgoraState) => state.userMap[state.localUid]
export const hostUserSelector = (state: AgoraState) => state.userMap[state.hostUid]
export const userCntSelector = (state: AgoraState) => Object.keys(state.userMap).length

//직접 수정
useAgoraStore.setState({shareUid: '123'})
//직접 접근
useAgoraStore.getState().shareUid
```

## SSR + Nextjs

---

[https://codesandbox.io/s/ku82o?file=/pages/_app.js](https://codesandbox.io/s/ku82o?file=/pages/_app.js)

```tsx
//Store.js
import { useMemo } from 'react'
import create from 'zustand'

let store

const initialState = {
	count: 0
}

function initStore(preloadedState = initialState){
	return create((set, get) => ({
		...initialState,
		...preloadedState,
		increment: () => {
			set({ count: get().count + 1})
		}
	})
}

export const initializeStore = (preloadedState) => {
	let _store = store ?? initStore(preloadedState)

	// 초기 상태가 있는 페이지로 이동한 후 해당 상태를 스토어의 현재 상태와 병합하여 새 스토어를 만든다.
	if(preloadedState && store){
		_store = initStore({
			...store.getState(),
			...preloadedState,
		})
		
		// 현재 스토어는 초기화한다
		store = undefined
	}

	// SSG, SSR은 항상 새로운 Store를 만든다
	if(typeof window === 'undefined') return _store

	// Client에서는 Store를 한번만 생성한다.
	if(!store){
		store = _store
	}
	
	return _store
}

export const useHydrate(initialState){
	const state = typeof initialState === 'string' ? JSON.parse(initialState) : initialState
	const store = useMemo(() => initializeStore(state), [state])
	return store
}

//_app.js
import createContext from 'zustand/context'
import { useHydrate } from '.store'

const { Provider, useStore } = createContext()

export default function App({Component, pageProps}){
	const store = useHydrate(pageProps.initialZustandState)
	return(
		<Provider createStore={() => store}>
      <Component {...pageProps} />
    </Provider>
	)
}

// 사용
const Component = () => {
	const state = useStore()
	const slice = useStore(selector)
	...
}

//ssr.js [page]
export default function SSR() {
	return <Page/>
}

export function getServerSideProps(){
	const zustandStore = initializeStore()
	zustandStore.getState().increment()
	return {
		props: { initialZustandState: JSON.stringify(zustandStore.getState()) },
	}
}
```