import { Events, EventHandler, EventListener } from '../events/index.mjs'
import { DevToolsAdapter } from './adapter.mjs'
export namespace DevToolsInterface {
  export namespace Accessibility {
    /** Unique accessibility node identifier. */
    export type AXNodeId = string
    /** Enum of possible property types. */
    export type AXValueType =
      | 'boolean'
      | 'tristate'
      | 'booleanOrUndefined'
      | 'idref'
      | 'idrefList'
      | 'integer'
      | 'node'
      | 'nodeList'
      | 'number'
      | 'string'
      | 'computedString'
      | 'token'
      | 'tokenList'
      | 'domRelation'
      | 'role'
      | 'internalRole'
      | 'valueUndefined'
    /** Enum of possible property sources. */
    export type AXValueSourceType = 'attribute' | 'implicit' | 'style' | 'contents' | 'placeholder' | 'relatedElement'
    /** Enum of possible native property sources (as a subtype of a particular AXValueSourceType). */
    export type AXValueNativeSourceType = 'figcaption' | 'label' | 'labelfor' | 'labelwrapped' | 'legend' | 'tablecaption' | 'title' | 'other'
    /** A single source for a computed AX property. */
    export type AXValueSource = {
      type: AXValueSourceType
      value?: AXValue
      attribute?: string
      attributeValue?: AXValue
      superseded?: boolean
      nativeSource?: AXValueNativeSourceType
      nativeSourceValue?: AXValue
      invalid?: boolean
      invalidReason?: string
    }

    export type AXRelatedNode = { backendDOMNodeId: DOM.BackendNodeId; idref?: string; text?: string }

    export type AXProperty = { name: AXPropertyName; value: AXValue }
    /** A single computed AX property. */
    export type AXValue = { type: AXValueType; value?: any; relatedNodes?: AXRelatedNode[]; sources?: AXValueSource[] }
    /** Values of AXProperty name: - from 'busy' to 'roledescription': states which apply to every AX node - from 'live' to 'root': attributes which apply to nodes in live regions - from 'autocomplete' to 'valuetext': attributes which apply to widgets - from 'checked' to 'selected': states which apply to widgets - from 'activedescendant' to 'owns' - relationships between elements other than parent/child/sibling. */
    export type AXPropertyName =
      | 'busy'
      | 'disabled'
      | 'editable'
      | 'focusable'
      | 'focused'
      | 'hidden'
      | 'hiddenRoot'
      | 'invalid'
      | 'keyshortcuts'
      | 'settable'
      | 'roledescription'
      | 'live'
      | 'atomic'
      | 'relevant'
      | 'root'
      | 'autocomplete'
      | 'hasPopup'
      | 'level'
      | 'multiselectable'
      | 'orientation'
      | 'multiline'
      | 'readonly'
      | 'required'
      | 'valuemin'
      | 'valuemax'
      | 'valuetext'
      | 'checked'
      | 'expanded'
      | 'modal'
      | 'pressed'
      | 'selected'
      | 'activedescendant'
      | 'controls'
      | 'describedby'
      | 'details'
      | 'errormessage'
      | 'flowto'
      | 'labelledby'
      | 'owns'
    /** A node in the accessibility tree. */
    export type AXNode = {
      nodeId: AXNodeId
      ignored: boolean
      ignoredReasons?: AXProperty[]
      role?: AXValue
      name?: AXValue
      description?: AXValue
      value?: AXValue
      properties?: AXProperty[]
      childIds?: AXNodeId[]
      backendDOMNodeId?: DOM.BackendNodeId
    }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetPartialAXTreeRequest = {
      nodeId?: DOM.NodeId
      backendNodeId?: DOM.BackendNodeId
      objectId?: Runtime.RemoteObjectId
      fetchRelatives?: boolean
    }
    export type GetPartialAXTreeResponse = { nodes: AXNode[] }
    export type GetFullAXTreeRequest = {}
    export type GetFullAXTreeResponse = { nodes: AXNode[] }
  }
  export namespace Animation {
    /** Animation instance. */
    export type Animation = {
      id: string
      name: string
      pausedState: boolean
      playState: string
      playbackRate: number
      startTime: number
      currentTime: number
      type: 'CSSTransition' | 'CSSAnimation' | 'WebAnimation'
      source?: AnimationEffect
      cssId?: string
    }
    /** AnimationEffect instance */
    export type AnimationEffect = {
      delay: number
      endDelay: number
      iterationStart: number
      iterations: number
      duration: number
      direction: string
      fill: string
      backendNodeId?: DOM.BackendNodeId
      keyframesRule?: KeyframesRule
      easing: string
    }
    /** Keyframes Rule */
    export type KeyframesRule = { name?: string; keyframes: KeyframeStyle[] }
    /** Keyframe Style */
    export type KeyframeStyle = { offset: string; easing: string }
    export type AnimationCanceledEvent = { id: string }
    export type AnimationCreatedEvent = { id: string }
    export type AnimationStartedEvent = { animation: Animation }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetCurrentTimeRequest = { id: string }
    export type GetCurrentTimeResponse = { currentTime: number }
    export type GetPlaybackRateRequest = {}
    export type GetPlaybackRateResponse = { playbackRate: number }
    export type ReleaseAnimationsRequest = { animations: string[] }
    export type ReleaseAnimationsResponse = {}
    export type ResolveAnimationRequest = { animationId: string }
    export type ResolveAnimationResponse = { remoteObject: Runtime.RemoteObject }
    export type SeekAnimationsRequest = { animations: string[]; currentTime: number }
    export type SeekAnimationsResponse = {}
    export type SetPausedRequest = { animations: string[]; paused: boolean }
    export type SetPausedResponse = {}
    export type SetPlaybackRateRequest = { playbackRate: number }
    export type SetPlaybackRateResponse = {}
    export type SetTimingRequest = { animationId: string; duration: number; delay: number }
    export type SetTimingResponse = {}
  }
  export namespace ApplicationCache {
    /** Detailed application cache resource information. */
    export type ApplicationCacheResource = { url: string; size: number; type: string }
    /** Detailed application cache information. */
    export type ApplicationCache = {
      manifestURL: string
      size: number
      creationTime: number
      updateTime: number
      resources: ApplicationCacheResource[]
    }
    /** Frame identifier - manifest URL pair. */
    export type FrameWithManifest = { frameId: Page.FrameId; manifestURL: string; status: number }
    export type ApplicationCacheStatusUpdatedEvent = { frameId: Page.FrameId; manifestURL: string; status: number }
    export type NetworkStateUpdatedEvent = { isNowOnline: boolean }
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetApplicationCacheForFrameRequest = { frameId: Page.FrameId }
    export type GetApplicationCacheForFrameResponse = { applicationCache: ApplicationCache }
    export type GetFramesWithManifestsRequest = {}
    export type GetFramesWithManifestsResponse = { frameIds: FrameWithManifest[] }
    export type GetManifestForFrameRequest = { frameId: Page.FrameId }
    export type GetManifestForFrameResponse = { manifestURL: string }
  }
  export namespace Audits {
    export type GetEncodedResponseRequest = {
      requestId: Network.RequestId
      encoding: 'webp' | 'jpeg' | 'png'
      quality?: number
      sizeOnly?: boolean
    }
    export type GetEncodedResponseResponse = { body?: string; originalSize: number; encodedSize: number }
  }
  export namespace BackgroundService {
    /** The Background Service that will be associated with the commands/events. Every Background Service operates independently, but they share the same API. */
    export type ServiceName = 'backgroundFetch' | 'backgroundSync' | 'pushMessaging' | 'notifications' | 'paymentHandler'
    /** A key-value pair for additional event information to pass along. */
    export type EventMetadata = { key: string; value: string }

    export type BackgroundServiceEvent = {
      timestamp: Network.TimeSinceEpoch
      origin: string
      serviceWorkerRegistrationId: ServiceWorker.RegistrationID
      service: ServiceName
      eventName: string
      instanceId: string
      eventMetadata: EventMetadata[]
    }
    export type RecordingStateChangedEvent = { isRecording: boolean; service: ServiceName }
    export type BackgroundServiceEventReceivedEvent = { backgroundServiceEvent: BackgroundServiceEvent }
    export type StartObservingRequest = { service: ServiceName }
    export type StartObservingResponse = {}
    export type StopObservingRequest = { service: ServiceName }
    export type StopObservingResponse = {}
    export type SetRecordingRequest = { shouldRecord: boolean; service: ServiceName }
    export type SetRecordingResponse = {}
    export type ClearEventsRequest = { service: ServiceName }
    export type ClearEventsResponse = {}
  }
  export namespace Browser {
    export type WindowID = number
    /** The state of the browser window. */
    export type WindowState = 'normal' | 'minimized' | 'maximized' | 'fullscreen'
    /** Browser window bounds information */
    export type Bounds = { left?: number; top?: number; width?: number; height?: number; windowState?: WindowState }

    export type PermissionType =
      | 'accessibilityEvents'
      | 'audioCapture'
      | 'backgroundSync'
      | 'backgroundFetch'
      | 'clipboardRead'
      | 'clipboardWrite'
      | 'durableStorage'
      | 'flash'
      | 'geolocation'
      | 'midi'
      | 'midiSysex'
      | 'notifications'
      | 'paymentHandler'
      | 'periodicBackgroundSync'
      | 'protectedMediaIdentifier'
      | 'sensors'
      | 'videoCapture'
      | 'idleDetection'
      | 'wakeLockScreen'
      | 'wakeLockSystem'
    /** Chrome histogram bucket. */
    export type Bucket = { low: number; high: number; count: number }
    /** Chrome histogram. */
    export type Histogram = { name: string; sum: number; count: number; buckets: Bucket[] }
    export type GrantPermissionsRequest = {
      origin: string
      permissions: PermissionType[]
      browserContextId?: Target.BrowserContextID
    }
    export type GrantPermissionsResponse = {}
    export type ResetPermissionsRequest = { browserContextId?: Target.BrowserContextID }
    export type ResetPermissionsResponse = {}
    export type CloseRequest = {}
    export type CloseResponse = {}
    export type CrashRequest = {}
    export type CrashResponse = {}
    export type CrashGpuProcessRequest = {}
    export type CrashGpuProcessResponse = {}
    export type GetVersionRequest = {}
    export type GetVersionResponse = {
      protocolVersion: string
      product: string
      revision: string
      userAgent: string
      jsVersion: string
    }
    export type GetBrowserCommandLineRequest = {}
    export type GetBrowserCommandLineResponse = { arguments: string[] }
    export type GetHistogramsRequest = { query?: string; delta?: boolean }
    export type GetHistogramsResponse = { histograms: Histogram[] }
    export type GetHistogramRequest = { name: string; delta?: boolean }
    export type GetHistogramResponse = { histogram: Histogram }
    export type GetWindowBoundsRequest = { windowId: WindowID }
    export type GetWindowBoundsResponse = { bounds: Bounds }
    export type GetWindowForTargetRequest = { targetId?: Target.TargetID }
    export type GetWindowForTargetResponse = { windowId: WindowID; bounds: Bounds }
    export type SetWindowBoundsRequest = { windowId: WindowID; bounds: Bounds }
    export type SetWindowBoundsResponse = {}
    export type SetDockTileRequest = { badgeLabel?: string; image?: string }
    export type SetDockTileResponse = {}
  }
  export namespace CSS {
    export type StyleSheetId = string
    /** Stylesheet type: "injected" for stylesheets injected via extension, "user-agent" for user-agent stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), "regular" for regular stylesheets. */
    export type StyleSheetOrigin = 'injected' | 'user-agent' | 'inspector' | 'regular'
    /** CSS rule collection for a single pseudo style. */
    export type PseudoElementMatches = { pseudoType: DOM.PseudoType; matches: RuleMatch[] }
    /** Inherited CSS rule collection from ancestor node. */
    export type InheritedStyleEntry = { inlineStyle?: CSSStyle; matchedCSSRules: RuleMatch[] }
    /** Match data for a CSS rule. */
    export type RuleMatch = { rule: CSSRule; matchingSelectors: number[] }
    /** Data for a simple selector (these are delimited by commas in a selector list). */
    export type Value = { text: string; range?: SourceRange }
    /** Selector list data. */
    export type SelectorList = { selectors: Value[]; text: string }
    /** CSS stylesheet metainformation. */
    export type CSSStyleSheetHeader = {
      styleSheetId: StyleSheetId
      frameId: Page.FrameId
      sourceURL: string
      sourceMapURL?: string
      origin: StyleSheetOrigin
      title: string
      ownerNode?: DOM.BackendNodeId
      disabled: boolean
      hasSourceURL?: boolean
      isInline: boolean
      startLine: number
      startColumn: number
      length: number
    }
    /** CSS rule representation. */
    export type CSSRule = {
      styleSheetId?: StyleSheetId
      selectorList: SelectorList
      origin: StyleSheetOrigin
      style: CSSStyle
      media?: CSSMedia[]
    }
    /** CSS coverage information. */
    export type RuleUsage = { styleSheetId: StyleSheetId; startOffset: number; endOffset: number; used: boolean }
    /** Text range within a resource. All numbers are zero-based. */
    export type SourceRange = { startLine: number; startColumn: number; endLine: number; endColumn: number }

    export type ShorthandEntry = { name: string; value: string; important?: boolean }

    export type CSSComputedStyleProperty = { name: string; value: string }
    /** CSS style representation. */
    export type CSSStyle = {
      styleSheetId?: StyleSheetId
      cssProperties: CSSProperty[]
      shorthandEntries: ShorthandEntry[]
      cssText?: string
      range?: SourceRange
    }
    /** CSS property declaration data. */
    export type CSSProperty = {
      name: string
      value: string
      important?: boolean
      implicit?: boolean
      text?: string
      parsedOk?: boolean
      disabled?: boolean
      range?: SourceRange
    }
    /** CSS media rule descriptor. */
    export type CSSMedia = {
      text: string
      source: 'mediaRule' | 'importRule' | 'linkedSheet' | 'inlineSheet'
      sourceURL?: string
      range?: SourceRange
      styleSheetId?: StyleSheetId
      mediaList?: MediaQuery[]
    }
    /** Media query descriptor. */
    export type MediaQuery = { expressions: MediaQueryExpression[]; active: boolean }
    /** Media query expression descriptor. */
    export type MediaQueryExpression = {
      value: number
      unit: string
      feature: string
      valueRange?: SourceRange
      computedLength?: number
    }
    /** Information about amount of glyphs that were rendered with given font. */
    export type PlatformFontUsage = { familyName: string; isCustomFont: boolean; glyphCount: number }
    /** Properties of a web font: https://www.w3.org/TR/2008/REC-CSS2-20080411/fonts.html#font-descriptions */
    export type FontFace = {
      fontFamily: string
      fontStyle: string
      fontVariant: string
      fontWeight: string
      fontStretch: string
      unicodeRange: string
      src: string
      platformFontFamily: string
    }
    /** CSS keyframes rule representation. */
    export type CSSKeyframesRule = { animationName: Value; keyframes: CSSKeyframeRule[] }
    /** CSS keyframe rule representation. */
    export type CSSKeyframeRule = {
      styleSheetId?: StyleSheetId
      origin: StyleSheetOrigin
      keyText: Value
      style: CSSStyle
    }
    /** A descriptor of operation to mutate style declaration text. */
    export type StyleDeclarationEdit = { styleSheetId: StyleSheetId; range: SourceRange; text: string }
    export type FontsUpdatedEvent = { font?: FontFace }
    export type MediaQueryResultChangedEvent = { [key: string]: any }
    export type StyleSheetAddedEvent = { header: CSSStyleSheetHeader }
    export type StyleSheetChangedEvent = { styleSheetId: StyleSheetId }
    export type StyleSheetRemovedEvent = { styleSheetId: StyleSheetId }
    export type AddRuleRequest = { styleSheetId: StyleSheetId; ruleText: string; location: SourceRange }
    export type AddRuleResponse = { rule: CSSRule }
    export type CollectClassNamesRequest = { styleSheetId: StyleSheetId }
    export type CollectClassNamesResponse = { classNames: string[] }
    export type CreateStyleSheetRequest = { frameId: Page.FrameId }
    export type CreateStyleSheetResponse = { styleSheetId: StyleSheetId }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type ForcePseudoStateRequest = { nodeId: DOM.NodeId; forcedPseudoClasses: string[] }
    export type ForcePseudoStateResponse = {}
    export type GetBackgroundColorsRequest = { nodeId: DOM.NodeId }
    export type GetBackgroundColorsResponse = {
      backgroundColors?: string[]
      computedFontSize?: string
      computedFontWeight?: string
    }
    export type GetComputedStyleForNodeRequest = { nodeId: DOM.NodeId }
    export type GetComputedStyleForNodeResponse = { computedStyle: CSSComputedStyleProperty[] }
    export type GetInlineStylesForNodeRequest = { nodeId: DOM.NodeId }
    export type GetInlineStylesForNodeResponse = { inlineStyle?: CSSStyle; attributesStyle?: CSSStyle }
    export type GetMatchedStylesForNodeRequest = { nodeId: DOM.NodeId }
    export type GetMatchedStylesForNodeResponse = {
      inlineStyle?: CSSStyle
      attributesStyle?: CSSStyle
      matchedCSSRules?: RuleMatch[]
      pseudoElements?: PseudoElementMatches[]
      inherited?: InheritedStyleEntry[]
      cssKeyframesRules?: CSSKeyframesRule[]
    }
    export type GetMediaQueriesRequest = {}
    export type GetMediaQueriesResponse = { medias: CSSMedia[] }
    export type GetPlatformFontsForNodeRequest = { nodeId: DOM.NodeId }
    export type GetPlatformFontsForNodeResponse = { fonts: PlatformFontUsage[] }
    export type GetStyleSheetTextRequest = { styleSheetId: StyleSheetId }
    export type GetStyleSheetTextResponse = { text: string }
    export type SetEffectivePropertyValueForNodeRequest = { nodeId: DOM.NodeId; propertyName: string; value: string }
    export type SetEffectivePropertyValueForNodeResponse = {}
    export type SetKeyframeKeyRequest = { styleSheetId: StyleSheetId; range: SourceRange; keyText: string }
    export type SetKeyframeKeyResponse = { keyText: Value }
    export type SetMediaTextRequest = { styleSheetId: StyleSheetId; range: SourceRange; text: string }
    export type SetMediaTextResponse = { media: CSSMedia }
    export type SetRuleSelectorRequest = { styleSheetId: StyleSheetId; range: SourceRange; selector: string }
    export type SetRuleSelectorResponse = { selectorList: SelectorList }
    export type SetStyleSheetTextRequest = { styleSheetId: StyleSheetId; text: string }
    export type SetStyleSheetTextResponse = { sourceMapURL?: string }
    export type SetStyleTextsRequest = { edits: StyleDeclarationEdit[] }
    export type SetStyleTextsResponse = { styles: CSSStyle[] }
    export type StartRuleUsageTrackingRequest = {}
    export type StartRuleUsageTrackingResponse = {}
    export type StopRuleUsageTrackingRequest = {}
    export type StopRuleUsageTrackingResponse = { ruleUsage: RuleUsage[] }
    export type TakeCoverageDeltaRequest = {}
    export type TakeCoverageDeltaResponse = { coverage: RuleUsage[] }
  }
  export namespace CacheStorage {
    /** Unique identifier of the Cache object. */
    export type CacheId = string
    /** type of HTTP response cached */
    export type CachedResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaqueResponse' | 'opaqueRedirect'
    /** Data entry. */
    export type DataEntry = {
      requestURL: string
      requestMethod: string
      requestHeaders: Header[]
      responseTime: number
      responseStatus: number
      responseStatusText: string
      responseType: CachedResponseType
      responseHeaders: Header[]
    }
    /** Cache identifier. */
    export type Cache = { cacheId: CacheId; securityOrigin: string; cacheName: string }

    export type Header = { name: string; value: string }
    /** Cached response */
    export type CachedResponse = { body: string }
    export type DeleteCacheRequest = { cacheId: CacheId }
    export type DeleteCacheResponse = {}
    export type DeleteEntryRequest = { cacheId: CacheId; request: string }
    export type DeleteEntryResponse = {}
    export type RequestCacheNamesRequest = { securityOrigin: string }
    export type RequestCacheNamesResponse = { caches: Cache[] }
    export type RequestCachedResponseRequest = { cacheId: CacheId; requestURL: string; requestHeaders: Header[] }
    export type RequestCachedResponseResponse = { response: CachedResponse }
    export type RequestEntriesRequest = { cacheId: CacheId; skipCount: number; pageSize: number; pathFilter?: string }
    export type RequestEntriesResponse = { cacheDataEntries: DataEntry[]; returnCount: number }
  }
  export namespace Cast {
    export type Sink = { name: string; id: string; session?: string }
    export type SinksUpdatedEvent = { sinks: Sink[] }
    export type IssueUpdatedEvent = { issueMessage: string }
    export type EnableRequest = { presentationUrl?: string }
    export type EnableResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type SetSinkToUseRequest = { sinkName: string }
    export type SetSinkToUseResponse = {}
    export type StartTabMirroringRequest = { sinkName: string }
    export type StartTabMirroringResponse = {}
    export type StopCastingRequest = { sinkName: string }
    export type StopCastingResponse = {}
  }
  export namespace DOM {
    /** Unique DOM node identifier. */
    export type NodeId = number
    /** Unique DOM node identifier used to reference a node that may not have been pushed to the front-end. */
    export type BackendNodeId = number
    /** Backend node with a friendly name. */
    export type BackendNode = { nodeType: number; nodeName: string; backendNodeId: BackendNodeId }
    /** Pseudo element type. */
    export type PseudoType =
      | 'first-line'
      | 'first-letter'
      | 'before'
      | 'after'
      | 'backdrop'
      | 'selection'
      | 'first-line-inherited'
      | 'scrollbar'
      | 'scrollbar-thumb'
      | 'scrollbar-button'
      | 'scrollbar-track'
      | 'scrollbar-track-piece'
      | 'scrollbar-corner'
      | 'resizer'
      | 'input-list-button'
    /** Shadow root type. */
    export type ShadowRootType = 'user-agent' | 'open' | 'closed'
    /** DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type. */
    export type Node = {
      nodeId: NodeId
      parentId?: NodeId
      backendNodeId: BackendNodeId
      nodeType: number
      nodeName: string
      localName: string
      nodeValue: string
      childNodeCount?: number
      children?: Node[]
      attributes?: string[]
      documentURL?: string
      baseURL?: string
      publicId?: string
      systemId?: string
      internalSubset?: string
      xmlVersion?: string
      name?: string
      value?: string
      pseudoType?: PseudoType
      shadowRootType?: ShadowRootType
      frameId?: Page.FrameId
      contentDocument?: Node
      shadowRoots?: Node[]
      templateContent?: Node
      pseudoElements?: Node[]
      importedDocument?: Node
      distributedNodes?: BackendNode[]
      isSVG?: boolean
    }
    /** A structure holding an RGBA color. */
    export type RGBA = { r: number; g: number; b: number; a?: number }
    /** An array of quad vertices, x immediately followed by y for each point, points clock-wise. */
    export type Quad = number[]
    /** Box model. */
    export type BoxModel = {
      content: Quad
      padding: Quad
      border: Quad
      margin: Quad
      width: number
      height: number
      shapeOutside?: ShapeOutsideInfo
    }
    /** CSS Shape Outside details. */
    export type ShapeOutsideInfo = { bounds: Quad; shape: any[]; marginShape: any[] }
    /** Rectangle. */
    export type Rect = { x: number; y: number; width: number; height: number }
    export type AttributeModifiedEvent = { nodeId: NodeId; name: string; value: string }
    export type AttributeRemovedEvent = { nodeId: NodeId; name: string }
    export type CharacterDataModifiedEvent = { nodeId: NodeId; characterData: string }
    export type ChildNodeCountUpdatedEvent = { nodeId: NodeId; childNodeCount: number }
    export type ChildNodeInsertedEvent = { parentNodeId: NodeId; previousNodeId: NodeId; node: Node }
    export type ChildNodeRemovedEvent = { parentNodeId: NodeId; nodeId: NodeId }
    export type DistributedNodesUpdatedEvent = { insertionPointId: NodeId; distributedNodes: BackendNode[] }
    export type DocumentUpdatedEvent = { [key: string]: any }
    export type InlineStyleInvalidatedEvent = { nodeIds: NodeId[] }
    export type PseudoElementAddedEvent = { parentId: NodeId; pseudoElement: Node }
    export type PseudoElementRemovedEvent = { parentId: NodeId; pseudoElementId: NodeId }
    export type SetChildNodesEvent = { parentId: NodeId; nodes: Node[] }
    export type ShadowRootPoppedEvent = { hostId: NodeId; rootId: NodeId }
    export type ShadowRootPushedEvent = { hostId: NodeId; root: Node }
    export type CollectClassNamesFromSubtreeRequest = { nodeId: NodeId }
    export type CollectClassNamesFromSubtreeResponse = { classNames: string[] }
    export type CopyToRequest = { nodeId: NodeId; targetNodeId: NodeId; insertBeforeNodeId?: NodeId }
    export type CopyToResponse = { nodeId: NodeId }
    export type DescribeNodeRequest = {
      nodeId?: NodeId
      backendNodeId?: BackendNodeId
      objectId?: Runtime.RemoteObjectId
      depth?: number
      pierce?: boolean
    }
    export type DescribeNodeResponse = { node: Node }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type DiscardSearchResultsRequest = { searchId: string }
    export type DiscardSearchResultsResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type FocusRequest = { nodeId?: NodeId; backendNodeId?: BackendNodeId; objectId?: Runtime.RemoteObjectId }
    export type FocusResponse = {}
    export type GetAttributesRequest = { nodeId: NodeId }
    export type GetAttributesResponse = { attributes: string[] }
    export type GetBoxModelRequest = {
      nodeId?: NodeId
      backendNodeId?: BackendNodeId
      objectId?: Runtime.RemoteObjectId
    }
    export type GetBoxModelResponse = { model: BoxModel }
    export type GetContentQuadsRequest = {
      nodeId?: NodeId
      backendNodeId?: BackendNodeId
      objectId?: Runtime.RemoteObjectId
    }
    export type GetContentQuadsResponse = { quads: Quad[] }
    export type GetDocumentRequest = { depth?: number; pierce?: boolean }
    export type GetDocumentResponse = { root: Node }
    export type GetFlattenedDocumentRequest = { depth?: number; pierce?: boolean }
    export type GetFlattenedDocumentResponse = { nodes: Node[] }
    export type GetNodeForLocationRequest = { x: number; y: number; includeUserAgentShadowDOM?: boolean }
    export type GetNodeForLocationResponse = { backendNodeId: BackendNodeId; nodeId?: NodeId }
    export type GetOuterHTMLRequest = {
      nodeId?: NodeId
      backendNodeId?: BackendNodeId
      objectId?: Runtime.RemoteObjectId
    }
    export type GetOuterHTMLResponse = { outerHTML: string }
    export type GetRelayoutBoundaryRequest = { nodeId: NodeId }
    export type GetRelayoutBoundaryResponse = { nodeId: NodeId }
    export type GetSearchResultsRequest = { searchId: string; fromIndex: number; toIndex: number }
    export type GetSearchResultsResponse = { nodeIds: NodeId[] }
    export type HideHighlightRequest = {}
    export type HideHighlightResponse = {}
    export type HighlightNodeRequest = {}
    export type HighlightNodeResponse = {}
    export type HighlightRectRequest = {}
    export type HighlightRectResponse = {}
    export type MarkUndoableStateRequest = {}
    export type MarkUndoableStateResponse = {}
    export type MoveToRequest = { nodeId: NodeId; targetNodeId: NodeId; insertBeforeNodeId?: NodeId }
    export type MoveToResponse = { nodeId: NodeId }
    export type PerformSearchRequest = { query: string; includeUserAgentShadowDOM?: boolean }
    export type PerformSearchResponse = { searchId: string; resultCount: number }
    export type PushNodeByPathToFrontendRequest = { path: string }
    export type PushNodeByPathToFrontendResponse = { nodeId: NodeId }
    export type PushNodesByBackendIdsToFrontendRequest = { backendNodeIds: BackendNodeId[] }
    export type PushNodesByBackendIdsToFrontendResponse = { nodeIds: NodeId[] }
    export type QuerySelectorRequest = { nodeId: NodeId; selector: string }
    export type QuerySelectorResponse = { nodeId: NodeId }
    export type QuerySelectorAllRequest = { nodeId: NodeId; selector: string }
    export type QuerySelectorAllResponse = { nodeIds: NodeId[] }
    export type RedoRequest = {}
    export type RedoResponse = {}
    export type RemoveAttributeRequest = { nodeId: NodeId; name: string }
    export type RemoveAttributeResponse = {}
    export type RemoveNodeRequest = { nodeId: NodeId }
    export type RemoveNodeResponse = {}
    export type RequestChildNodesRequest = { nodeId: NodeId; depth?: number; pierce?: boolean }
    export type RequestChildNodesResponse = {}
    export type RequestNodeRequest = { objectId: Runtime.RemoteObjectId }
    export type RequestNodeResponse = { nodeId: NodeId }
    export type ResolveNodeRequest = {
      nodeId?: NodeId
      backendNodeId?: DOM.BackendNodeId
      objectGroup?: string
      executionContextId?: Runtime.ExecutionContextId
    }
    export type ResolveNodeResponse = { object: Runtime.RemoteObject }
    export type SetAttributeValueRequest = { nodeId: NodeId; name: string; value: string }
    export type SetAttributeValueResponse = {}
    export type SetAttributesAsTextRequest = { nodeId: NodeId; text: string; name?: string }
    export type SetAttributesAsTextResponse = {}
    export type SetFileInputFilesRequest = {
      files: string[]
      nodeId?: NodeId
      backendNodeId?: BackendNodeId
      objectId?: Runtime.RemoteObjectId
    }
    export type SetFileInputFilesResponse = {}
    export type GetFileInfoRequest = { objectId: Runtime.RemoteObjectId }
    export type GetFileInfoResponse = { path: string }
    export type SetInspectedNodeRequest = { nodeId: NodeId }
    export type SetInspectedNodeResponse = {}
    export type SetNodeNameRequest = { nodeId: NodeId; name: string }
    export type SetNodeNameResponse = { nodeId: NodeId }
    export type SetNodeValueRequest = { nodeId: NodeId; value: string }
    export type SetNodeValueResponse = {}
    export type SetOuterHTMLRequest = { nodeId: NodeId; outerHTML: string }
    export type SetOuterHTMLResponse = {}
    export type UndoRequest = {}
    export type UndoResponse = {}
    export type GetFrameOwnerRequest = { frameId: Page.FrameId }
    export type GetFrameOwnerResponse = { backendNodeId: BackendNodeId; nodeId?: NodeId }
  }
  export namespace DOMDebugger {
    /** DOM breakpoint type. */
    export type DOMBreakpointType = 'subtree-modified' | 'attribute-modified' | 'node-removed'
    /** Object event listener. */
    export type EventListener = {
      type: string
      useCapture: boolean
      passive: boolean
      once: boolean
      scriptId: Runtime.ScriptId
      lineNumber: number
      columnNumber: number
      handler?: Runtime.RemoteObject
      originalHandler?: Runtime.RemoteObject
      backendNodeId?: DOM.BackendNodeId
    }
    export type GetEventListenersRequest = { objectId: Runtime.RemoteObjectId; depth?: number; pierce?: boolean }
    export type GetEventListenersResponse = { listeners: EventListener[] }
    export type RemoveDOMBreakpointRequest = { nodeId: DOM.NodeId; type: DOMBreakpointType }
    export type RemoveDOMBreakpointResponse = {}
    export type RemoveEventListenerBreakpointRequest = { eventName: string; targetName?: string }
    export type RemoveEventListenerBreakpointResponse = {}
    export type RemoveInstrumentationBreakpointRequest = { eventName: string }
    export type RemoveInstrumentationBreakpointResponse = {}
    export type RemoveXHRBreakpointRequest = { url: string }
    export type RemoveXHRBreakpointResponse = {}
    export type SetDOMBreakpointRequest = { nodeId: DOM.NodeId; type: DOMBreakpointType }
    export type SetDOMBreakpointResponse = {}
    export type SetEventListenerBreakpointRequest = { eventName: string; targetName?: string }
    export type SetEventListenerBreakpointResponse = {}
    export type SetInstrumentationBreakpointRequest = { eventName: string }
    export type SetInstrumentationBreakpointResponse = {}
    export type SetXHRBreakpointRequest = { url: string }
    export type SetXHRBreakpointResponse = {}
  }
  export namespace DOMSnapshot {
    /** A Node in the DOM tree. */
    export type DOMNode = {
      nodeType: number
      nodeName: string
      nodeValue: string
      textValue?: string
      inputValue?: string
      inputChecked?: boolean
      optionSelected?: boolean
      backendNodeId: DOM.BackendNodeId
      childNodeIndexes?: number[]
      attributes?: NameValue[]
      pseudoElementIndexes?: number[]
      layoutNodeIndex?: number
      documentURL?: string
      baseURL?: string
      contentLanguage?: string
      documentEncoding?: string
      publicId?: string
      systemId?: string
      frameId?: Page.FrameId
      contentDocumentIndex?: number
      pseudoType?: DOM.PseudoType
      shadowRootType?: DOM.ShadowRootType
      isClickable?: boolean
      eventListeners?: DOMDebugger.EventListener[]
      currentSourceURL?: string
      originURL?: string
      scrollOffsetX?: number
      scrollOffsetY?: number
    }
    /** Details of post layout rendered text positions. The exact layout should not be regarded as stable and may change between versions. */
    export type InlineTextBox = { boundingBox: DOM.Rect; startCharacterIndex: number; numCharacters: number }
    /** Details of an element in the DOM tree with a LayoutObject. */
    export type LayoutTreeNode = {
      domNodeIndex: number
      boundingBox: DOM.Rect
      layoutText?: string
      inlineTextNodes?: InlineTextBox[]
      styleIndex?: number
      paintOrder?: number
      isStackingContext?: boolean
    }
    /** A subset of the full ComputedStyle as defined by the request whitelist. */
    export type ComputedStyle = { properties: NameValue[] }
    /** A name/value pair. */
    export type NameValue = { name: string; value: string }
    /** Index of the string in the strings table. */
    export type StringIndex = number
    /** Index of the string in the strings table. */
    export type ArrayOfStrings = StringIndex[]
    /** Data that is only present on rare nodes. */
    export type RareStringData = { index: number[]; value: StringIndex[] }

    export type RareBooleanData = { index: number[] }

    export type RareIntegerData = { index: number[]; value: number[] }

    export type Rectangle = number[]
    /** Document snapshot. */
    export type DocumentSnapshot = {
      documentURL: StringIndex
      baseURL: StringIndex
      contentLanguage: StringIndex
      encodingName: StringIndex
      publicId: StringIndex
      systemId: StringIndex
      frameId: StringIndex
      nodes: NodeTreeSnapshot
      layout: LayoutTreeSnapshot
      textBoxes: TextBoxSnapshot
      scrollOffsetX?: number
      scrollOffsetY?: number
    }
    /** Table containing nodes. */
    export type NodeTreeSnapshot = {
      parentIndex?: number[]
      nodeType?: number[]
      nodeName?: StringIndex[]
      nodeValue?: StringIndex[]
      backendNodeId?: DOM.BackendNodeId[]
      attributes?: ArrayOfStrings[]
      textValue?: RareStringData
      inputValue?: RareStringData
      inputChecked?: RareBooleanData
      optionSelected?: RareBooleanData
      contentDocumentIndex?: RareIntegerData
      pseudoType?: RareStringData
      isClickable?: RareBooleanData
      currentSourceURL?: RareStringData
      originURL?: RareStringData
    }
    /** Table of details of an element in the DOM tree with a LayoutObject. */
    export type LayoutTreeSnapshot = {
      nodeIndex: number[]
      styles: ArrayOfStrings[]
      bounds: Rectangle[]
      text: StringIndex[]
      stackingContexts: RareBooleanData
      offsetRects?: Rectangle[]
      scrollRects?: Rectangle[]
      clientRects?: Rectangle[]
    }
    /** Table of details of the post layout rendered text positions. The exact layout should not be regarded as stable and may change between versions. */
    export type TextBoxSnapshot = { layoutIndex: number[]; bounds: Rectangle[]; start: number[]; length: number[] }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetSnapshotRequest = {
      computedStyleWhitelist: string[]
      includeEventListeners?: boolean
      includePaintOrder?: boolean
      includeUserAgentShadowTree?: boolean
    }
    export type GetSnapshotResponse = {
      domNodes: DOMNode[]
      layoutTreeNodes: LayoutTreeNode[]
      computedStyles: ComputedStyle[]
    }
    export type CaptureSnapshotRequest = { computedStyles: string[]; includeDOMRects?: boolean }
    export type CaptureSnapshotResponse = { documents: DocumentSnapshot[]; strings: string[] }
  }
  export namespace DOMStorage {
    /** DOM Storage identifier. */
    export type StorageId = { securityOrigin: string; isLocalStorage: boolean }
    /** DOM Storage item. */
    export type Item = string[]
    export type DomStorageItemAddedEvent = { storageId: StorageId; key: string; newValue: string }
    export type DomStorageItemRemovedEvent = { storageId: StorageId; key: string }
    export type DomStorageItemUpdatedEvent = { storageId: StorageId; key: string; oldValue: string; newValue: string }
    export type DomStorageItemsClearedEvent = { storageId: StorageId }
    export type ClearRequest = { storageId: StorageId }
    export type ClearResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetDOMStorageItemsRequest = { storageId: StorageId }
    export type GetDOMStorageItemsResponse = { entries: Item[] }
    export type RemoveDOMStorageItemRequest = { storageId: StorageId; key: string }
    export type RemoveDOMStorageItemResponse = {}
    export type SetDOMStorageItemRequest = { storageId: StorageId; key: string; value: string }
    export type SetDOMStorageItemResponse = {}
  }
  export namespace Database {
    /** Unique identifier of Database object. */
    export type DatabaseId = string
    /** Database object. */
    export type Database = { id: DatabaseId; domain: string; name: string; version: string }
    /** Database error. */
    export type Error = { message: string; code: number }
    export type AddDatabaseEvent = { database: Database }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type ExecuteSQLRequest = { databaseId: DatabaseId; query: string }
    export type ExecuteSQLResponse = { columnNames?: string[]; values?: any[]; sqlError?: Error }
    export type GetDatabaseTableNamesRequest = { databaseId: DatabaseId }
    export type GetDatabaseTableNamesResponse = { tableNames: string[] }
  }
  export namespace DeviceOrientation {
    export type ClearDeviceOrientationOverrideRequest = {}
    export type ClearDeviceOrientationOverrideResponse = {}
    export type SetDeviceOrientationOverrideRequest = { alpha: number; beta: number; gamma: number }
    export type SetDeviceOrientationOverrideResponse = {}
  }
  export namespace Emulation {
    /** Screen orientation. */
    export type ScreenOrientation = {
      type: 'portraitPrimary' | 'portraitSecondary' | 'landscapePrimary' | 'landscapeSecondary'
      angle: number
    }
    /** advance: If the scheduler runs out of immediate work, the virtual time base may fast forward to allow the next delayed task (if any) to run; pause: The virtual time base may not advance; pauseIfNetworkFetchesPending: The virtual time base may not advance if there are any pending resource fetches. */
    export type VirtualTimePolicy = 'advance' | 'pause' | 'pauseIfNetworkFetchesPending'
    export type VirtualTimeBudgetExpiredEvent = { [key: string]: any }
    export type CanEmulateRequest = {}
    export type CanEmulateResponse = { result: boolean }
    export type ClearDeviceMetricsOverrideRequest = {}
    export type ClearDeviceMetricsOverrideResponse = {}
    export type ClearGeolocationOverrideRequest = {}
    export type ClearGeolocationOverrideResponse = {}
    export type ResetPageScaleFactorRequest = {}
    export type ResetPageScaleFactorResponse = {}
    export type SetFocusEmulationEnabledRequest = { enabled: boolean }
    export type SetFocusEmulationEnabledResponse = {}
    export type SetCPUThrottlingRateRequest = { rate: number }
    export type SetCPUThrottlingRateResponse = {}
    export type SetDefaultBackgroundColorOverrideRequest = { color?: DOM.RGBA }
    export type SetDefaultBackgroundColorOverrideResponse = {}
    export type SetDeviceMetricsOverrideRequest = {
      width: number
      height: number
      deviceScaleFactor: number
      mobile: boolean
      scale?: number
      screenWidth?: number
      screenHeight?: number
      positionX?: number
      positionY?: number
      dontSetVisibleSize?: boolean
      screenOrientation?: ScreenOrientation
      viewport?: Page.Viewport
    }
    export type SetDeviceMetricsOverrideResponse = {}
    export type SetScrollbarsHiddenRequest = { hidden: boolean }
    export type SetScrollbarsHiddenResponse = {}
    export type SetDocumentCookieDisabledRequest = { disabled: boolean }
    export type SetDocumentCookieDisabledResponse = {}
    export type SetEmitTouchEventsForMouseRequest = { enabled: boolean; configuration?: 'mobile' | 'desktop' }
    export type SetEmitTouchEventsForMouseResponse = {}
    export type SetEmulatedMediaRequest = { media: string }
    export type SetEmulatedMediaResponse = {}
    export type SetGeolocationOverrideRequest = { latitude?: number; longitude?: number; accuracy?: number }
    export type SetGeolocationOverrideResponse = {}
    export type SetNavigatorOverridesRequest = { platform: string }
    export type SetNavigatorOverridesResponse = {}
    export type SetPageScaleFactorRequest = { pageScaleFactor: number }
    export type SetPageScaleFactorResponse = {}
    export type SetScriptExecutionDisabledRequest = { value: boolean }
    export type SetScriptExecutionDisabledResponse = {}
    export type SetTouchEmulationEnabledRequest = { enabled: boolean; maxTouchPoints?: number }
    export type SetTouchEmulationEnabledResponse = {}
    export type SetVirtualTimePolicyRequest = {
      policy: VirtualTimePolicy
      budget?: number
      maxVirtualTimeTaskStarvationCount?: number
      waitForNavigation?: boolean
      initialVirtualTime?: Network.TimeSinceEpoch
    }
    export type SetVirtualTimePolicyResponse = { virtualTimeTicksBase: number }
    export type SetTimezoneOverrideRequest = { timezoneId: string }
    export type SetTimezoneOverrideResponse = {}
    export type SetVisibleSizeRequest = { width: number; height: number }
    export type SetVisibleSizeResponse = {}
    export type SetUserAgentOverrideRequest = { userAgent: string; acceptLanguage?: string; platform?: string }
    export type SetUserAgentOverrideResponse = {}
  }
  export namespace HeadlessExperimental {
    /** Encoding options for a screenshot. */
    export type ScreenshotParams = { format?: 'jpeg' | 'png'; quality?: number }
    export type NeedsBeginFramesChangedEvent = { needsBeginFrames: boolean }
    export type BeginFrameRequest = {
      frameTimeTicks?: number
      interval?: number
      noDisplayUpdates?: boolean
      screenshot?: ScreenshotParams
    }
    export type BeginFrameResponse = { hasDamage: boolean; screenshotData?: string }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
  }
  export namespace IO {
    /** This is either obtained from another method or specifed as `blob:&lt;uuid&gt;` where `&lt;uuid&gt` is an UUID of a Blob. */
    export type StreamHandle = string
    export type CloseRequest = { handle: StreamHandle }
    export type CloseResponse = {}
    export type ReadRequest = { handle: StreamHandle; offset?: number; size?: number }
    export type ReadResponse = { base64Encoded?: boolean; data: string; eof: boolean }
    export type ResolveBlobRequest = { objectId: Runtime.RemoteObjectId }
    export type ResolveBlobResponse = { uuid: string }
  }
  export namespace IndexedDB {
    /** Database with an array of object stores. */
    export type DatabaseWithObjectStores = { name: string; version: number; objectStores: ObjectStore[] }
    /** Object store. */
    export type ObjectStore = { name: string; keyPath: KeyPath; autoIncrement: boolean; indexes: ObjectStoreIndex[] }
    /** Object store index. */
    export type ObjectStoreIndex = { name: string; keyPath: KeyPath; unique: boolean; multiEntry: boolean }
    /** Key. */
    export type Key = {
      type: 'number' | 'string' | 'date' | 'array'
      number?: number
      string?: string
      date?: number
      array?: Key[]
    }
    /** Key range. */
    export type KeyRange = { lower?: Key; upper?: Key; lowerOpen: boolean; upperOpen: boolean }
    /** Data entry. */
    export type DataEntry = { key: Runtime.RemoteObject; primaryKey: Runtime.RemoteObject; value: Runtime.RemoteObject }
    /** Key path. */
    export type KeyPath = { type: 'null' | 'string' | 'array'; string?: string; array?: string[] }
    export type ClearObjectStoreRequest = { securityOrigin: string; databaseName: string; objectStoreName: string }
    export type ClearObjectStoreResponse = {}
    export type DeleteDatabaseRequest = { securityOrigin: string; databaseName: string }
    export type DeleteDatabaseResponse = {}
    export type DeleteObjectStoreEntriesRequest = {
      securityOrigin: string
      databaseName: string
      objectStoreName: string
      keyRange: KeyRange
    }
    export type DeleteObjectStoreEntriesResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type RequestDataRequest = {
      securityOrigin: string
      databaseName: string
      objectStoreName: string
      indexName: string
      skipCount: number
      pageSize: number
      keyRange?: KeyRange
    }
    export type RequestDataResponse = { objectStoreDataEntries: DataEntry[]; hasMore: boolean }
    export type GetMetadataRequest = { securityOrigin: string; databaseName: string; objectStoreName: string }
    export type GetMetadataResponse = { entriesCount: number; keyGeneratorValue: number }
    export type RequestDatabaseRequest = { securityOrigin: string; databaseName: string }
    export type RequestDatabaseResponse = { databaseWithObjectStores: DatabaseWithObjectStores }
    export type RequestDatabaseNamesRequest = { securityOrigin: string }
    export type RequestDatabaseNamesResponse = { databaseNames: string[] }
  }
  export namespace Input {
    export type TouchPoint = {
      x: number
      y: number
      radiusX?: number
      radiusY?: number
      rotationAngle?: number
      force?: number
      id?: number
    }

    export type GestureSourceType = 'default' | 'touch' | 'mouse'
    /** UTC time in seconds, counted from January 1, 1970. */
    export type TimeSinceEpoch = number
    export type DispatchKeyEventRequest = {
      type: 'keyDown' | 'keyUp' | 'rawKeyDown' | 'char'
      modifiers?: number
      timestamp?: TimeSinceEpoch
      text?: string
      unmodifiedText?: string
      keyIdentifier?: string
      code?: string
      key?: string
      windowsVirtualKeyCode?: number
      nativeVirtualKeyCode?: number
      autoRepeat?: boolean
      isKeypad?: boolean
      isSystemKey?: boolean
      location?: number
    }
    export type DispatchKeyEventResponse = {}
    export type InsertTextRequest = { text: string }
    export type InsertTextResponse = {}
    export type DispatchMouseEventRequest = {
      type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel'
      x: number
      y: number
      modifiers?: number
      timestamp?: TimeSinceEpoch
      button?: 'none' | 'left' | 'middle' | 'right' | 'back' | 'forward'
      buttons?: number
      clickCount?: number
      deltaX?: number
      deltaY?: number
      pointerType?: 'mouse' | 'pen'
    }
    export type DispatchMouseEventResponse = {}
    export type DispatchTouchEventRequest = {
      type: 'touchStart' | 'touchEnd' | 'touchMove' | 'touchCancel'
      touchPoints: TouchPoint[]
      modifiers?: number
      timestamp?: TimeSinceEpoch
    }
    export type DispatchTouchEventResponse = {}
    export type EmulateTouchFromMouseEventRequest = {
      type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel'
      x: number
      y: number
      button: 'none' | 'left' | 'middle' | 'right'
      timestamp?: TimeSinceEpoch
      deltaX?: number
      deltaY?: number
      modifiers?: number
      clickCount?: number
    }
    export type EmulateTouchFromMouseEventResponse = {}
    export type SetIgnoreInputEventsRequest = { ignore: boolean }
    export type SetIgnoreInputEventsResponse = {}
    export type SynthesizePinchGestureRequest = {
      x: number
      y: number
      scaleFactor: number
      relativeSpeed?: number
      gestureSourceType?: GestureSourceType
    }
    export type SynthesizePinchGestureResponse = {}
    export type SynthesizeScrollGestureRequest = {
      x: number
      y: number
      xDistance?: number
      yDistance?: number
      xOverscroll?: number
      yOverscroll?: number
      preventFling?: boolean
      speed?: number
      gestureSourceType?: GestureSourceType
      repeatCount?: number
      repeatDelayMs?: number
      interactionMarkerName?: string
    }
    export type SynthesizeScrollGestureResponse = {}
    export type SynthesizeTapGestureRequest = {
      x: number
      y: number
      duration?: number
      tapCount?: number
      gestureSourceType?: GestureSourceType
    }
    export type SynthesizeTapGestureResponse = {}
  }
  export namespace Inspector {
    export type DetachedEvent = { reason: string }
    export type TargetCrashedEvent = { [key: string]: any }
    export type TargetReloadedAfterCrashEvent = { [key: string]: any }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
  }
  export namespace LayerTree {
    /** Unique Layer identifier. */
    export type LayerId = string
    /** Unique snapshot identifier. */
    export type SnapshotId = string
    /** Rectangle where scrolling happens on the main thread. */
    export type ScrollRect = { rect: DOM.Rect; type: 'RepaintsOnScroll' | 'TouchEventHandler' | 'WheelEventHandler' }
    /** Sticky position constraints. */
    export type StickyPositionConstraint = {
      stickyBoxRect: DOM.Rect
      containingBlockRect: DOM.Rect
      nearestLayerShiftingStickyBox?: LayerId
      nearestLayerShiftingContainingBlock?: LayerId
    }
    /** Serialized fragment of layer picture along with its offset within the layer. */
    export type PictureTile = { x: number; y: number; picture: string }
    /** Information about a compositing layer. */
    export type Layer = {
      layerId: LayerId
      parentLayerId?: LayerId
      backendNodeId?: DOM.BackendNodeId
      offsetX: number
      offsetY: number
      width: number
      height: number
      transform?: number[]
      anchorX?: number
      anchorY?: number
      anchorZ?: number
      paintCount: number
      drawsContent: boolean
      invisible?: boolean
      scrollRects?: ScrollRect[]
      stickyPositionConstraint?: StickyPositionConstraint
    }
    /** Array of timings, one per paint step. */
    export type PaintProfile = number[]
    export type LayerPaintedEvent = { layerId: LayerId; clip: DOM.Rect }
    export type LayerTreeDidChangeEvent = { layers?: Layer[] }
    export type CompositingReasonsRequest = { layerId: LayerId }
    export type CompositingReasonsResponse = { compositingReasons: string[] }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type LoadSnapshotRequest = { tiles: PictureTile[] }
    export type LoadSnapshotResponse = { snapshotId: SnapshotId }
    export type MakeSnapshotRequest = { layerId: LayerId }
    export type MakeSnapshotResponse = { snapshotId: SnapshotId }
    export type ProfileSnapshotRequest = {
      snapshotId: SnapshotId
      minRepeatCount?: number
      minDuration?: number
      clipRect?: DOM.Rect
    }
    export type ProfileSnapshotResponse = { timings: PaintProfile[] }
    export type ReleaseSnapshotRequest = { snapshotId: SnapshotId }
    export type ReleaseSnapshotResponse = {}
    export type ReplaySnapshotRequest = { snapshotId: SnapshotId; fromStep?: number; toStep?: number; scale?: number }
    export type ReplaySnapshotResponse = { dataURL: string }
    export type SnapshotCommandLogRequest = { snapshotId: SnapshotId }
    export type SnapshotCommandLogResponse = { commandLog: { [key: string]: any }[] }
  }
  export namespace Log {
    /** Log entry. */
    export type LogEntry = {
      source:
        | 'xml'
        | 'javascript'
        | 'network'
        | 'storage'
        | 'appcache'
        | 'rendering'
        | 'security'
        | 'deprecation'
        | 'worker'
        | 'violation'
        | 'intervention'
        | 'recommendation'
        | 'other'
      level: 'verbose' | 'info' | 'warning' | 'error'
      text: string
      timestamp: Runtime.Timestamp
      url?: string
      lineNumber?: number
      stackTrace?: Runtime.StackTrace
      networkRequestId?: Network.RequestId
      workerId?: string
      args?: Runtime.RemoteObject[]
    }
    /** Violation configuration setting. */
    export type ViolationSetting = {
      name: 'longTask' | 'longLayout' | 'blockedEvent' | 'blockedParser' | 'discouragedAPIUse' | 'handler' | 'recurringHandler'
      threshold: number
    }
    export type EntryAddedEvent = { entry: LogEntry }
    export type ClearRequest = {}
    export type ClearResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type StartViolationsReportRequest = { config: ViolationSetting[] }
    export type StartViolationsReportResponse = {}
    export type StopViolationsReportRequest = {}
    export type StopViolationsReportResponse = {}
  }
  export namespace Memory {
    /** Memory pressure level. */
    export type PressureLevel = 'moderate' | 'critical'
    /** Heap profile sample. */
    export type SamplingProfileNode = { size: number; total: number; stack: string[] }
    /** Array of heap profile samples. */
    export type SamplingProfile = { samples: SamplingProfileNode[]; modules: Module[] }
    /** Executable module information */
    export type Module = { name: string; uuid: string; baseAddress: string; size: number }
    export type GetDOMCountersRequest = {}
    export type GetDOMCountersResponse = { documents: number; nodes: number; jsEventListeners: number }
    export type PrepareForLeakDetectionRequest = {}
    export type PrepareForLeakDetectionResponse = {}
    export type ForciblyPurgeJavaScriptMemoryRequest = {}
    export type ForciblyPurgeJavaScriptMemoryResponse = {}
    export type SetPressureNotificationsSuppressedRequest = { suppressed: boolean }
    export type SetPressureNotificationsSuppressedResponse = {}
    export type SimulatePressureNotificationRequest = { level: PressureLevel }
    export type SimulatePressureNotificationResponse = {}
    export type StartSamplingRequest = { samplingInterval?: number; suppressRandomness?: boolean }
    export type StartSamplingResponse = {}
    export type StopSamplingRequest = {}
    export type StopSamplingResponse = {}
    export type GetAllTimeSamplingProfileRequest = {}
    export type GetAllTimeSamplingProfileResponse = { profile: SamplingProfile }
    export type GetBrowserSamplingProfileRequest = {}
    export type GetBrowserSamplingProfileResponse = { profile: SamplingProfile }
    export type GetSamplingProfileRequest = {}
    export type GetSamplingProfileResponse = { profile: SamplingProfile }
  }
  export namespace Network {
    /** Resource type as it was perceived by the rendering engine. */
    export type ResourceType =
      | 'Document'
      | 'Stylesheet'
      | 'Image'
      | 'Media'
      | 'Font'
      | 'Script'
      | 'TextTrack'
      | 'XHR'
      | 'Fetch'
      | 'EventSource'
      | 'WebSocket'
      | 'Manifest'
      | 'SignedExchange'
      | 'Ping'
      | 'CSPViolationReport'
      | 'Other'
    /** Unique loader identifier. */
    export type LoaderId = string
    /** Unique request identifier. */
    export type RequestId = string
    /** Unique intercepted request identifier. */
    export type InterceptionId = string
    /** Network level fetch failure reason. */
    export type ErrorReason =
      | 'Failed'
      | 'Aborted'
      | 'TimedOut'
      | 'AccessDenied'
      | 'ConnectionClosed'
      | 'ConnectionReset'
      | 'ConnectionRefused'
      | 'ConnectionAborted'
      | 'ConnectionFailed'
      | 'NameNotResolved'
      | 'InternetDisconnected'
      | 'AddressUnreachable'
      | 'BlockedByClient'
      | 'BlockedByResponse'
    /** UTC time in seconds, counted from January 1, 1970. */
    export type TimeSinceEpoch = number
    /** Monotonically increasing time in seconds since an arbitrary point in the past. */
    export type MonotonicTime = number
    /** Request / response headers as keys / values of JSON object. */
    export type Headers = { [key: string]: any }
    /** The underlying connection technology that the browser is supposedly using. */
    export type ConnectionType = 'none' | 'cellular2g' | 'cellular3g' | 'cellular4g' | 'bluetooth' | 'ethernet' | 'wifi' | 'wimax' | 'other'
    /** Represents the cookie's 'SameSite' status: https://tools.ietf.org/html/draft-west-first-party-cookies */
    export type CookieSameSite = 'Strict' | 'Lax' | 'Extended' | 'None'
    /** Timing information for the request. */
    export type ResourceTiming = {
      requestTime: number
      proxyStart: number
      proxyEnd: number
      dnsStart: number
      dnsEnd: number
      connectStart: number
      connectEnd: number
      sslStart: number
      sslEnd: number
      workerStart: number
      workerReady: number
      sendStart: number
      sendEnd: number
      pushStart: number
      pushEnd: number
      receiveHeadersEnd: number
    }
    /** Loading priority of a resource request. */
    export type ResourcePriority = 'VeryLow' | 'Low' | 'Medium' | 'High' | 'VeryHigh'
    /** HTTP request data. */
    export type Request = {
      url: string
      urlFragment?: string
      method: string
      headers: Headers
      postData?: string
      hasPostData?: boolean
      mixedContentType?: Security.MixedContentType
      initialPriority: ResourcePriority
      referrerPolicy:
        | 'unsafe-url'
        | 'no-referrer-when-downgrade'
        | 'no-referrer'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
      isLinkPreload?: boolean
    }
    /** Details of a signed certificate timestamp (SCT). */
    export type SignedCertificateTimestamp = {
      status: string
      origin: string
      logDescription: string
      logId: string
      timestamp: TimeSinceEpoch
      hashAlgorithm: string
      signatureAlgorithm: string
      signatureData: string
    }
    /** Security details about a request. */
    export type SecurityDetails = {
      protocol: string
      keyExchange: string
      keyExchangeGroup?: string
      cipher: string
      mac?: string
      certificateId: Security.CertificateId
      subjectName: string
      sanList: string[]
      issuer: string
      validFrom: TimeSinceEpoch
      validTo: TimeSinceEpoch
      signedCertificateTimestampList: SignedCertificateTimestamp[]
      certificateTransparencyCompliance: CertificateTransparencyCompliance
    }
    /** Whether the request complied with Certificate Transparency policy. */
    export type CertificateTransparencyCompliance = 'unknown' | 'not-compliant' | 'compliant'
    /** The reason why request was blocked. */
    export type BlockedReason = 'other' | 'csp' | 'mixed-content' | 'origin' | 'inspector' | 'subresource-filter' | 'content-type' | 'collapsed-by-client'
    /** HTTP response data. */
    export type Response = {
      url: string
      status: number
      statusText: string
      headers: Headers
      headersText?: string
      mimeType: string
      requestHeaders?: Headers
      requestHeadersText?: string
      connectionReused: boolean
      connectionId: number
      remoteIPAddress?: string
      remotePort?: number
      fromDiskCache?: boolean
      fromServiceWorker?: boolean
      fromPrefetchCache?: boolean
      encodedDataLength: number
      timing?: ResourceTiming
      protocol?: string
      securityState: Security.SecurityState
      securityDetails?: SecurityDetails
    }
    /** WebSocket request data. */
    export type WebSocketRequest = { headers: Headers }
    /** WebSocket response data. */
    export type WebSocketResponse = {
      status: number
      statusText: string
      headers: Headers
      headersText?: string
      requestHeaders?: Headers
      requestHeadersText?: string
    }
    /** WebSocket message data. This represents an entire WebSocket message, not just a fragmented frame as the name suggests. */
    export type WebSocketFrame = { opcode: number; mask: boolean; payloadData: string }
    /** Information about the cached resource. */
    export type CachedResource = { url: string; type: ResourceType; response?: Response; bodySize: number }
    /** Information about the request initiator. */
    export type Initiator = {
      type: 'parser' | 'script' | 'preload' | 'SignedExchange' | 'other'
      stack?: Runtime.StackTrace
      url?: string
      lineNumber?: number
    }
    /** Cookie object */
    export type Cookie = {
      name: string
      value: string
      domain: string
      path: string
      expires: number
      size: number
      httpOnly: boolean
      secure: boolean
      session: boolean
      sameSite?: CookieSameSite
    }
    /** Cookie parameter object */
    export type CookieParam = {
      name: string
      value: string
      url?: string
      domain?: string
      path?: string
      secure?: boolean
      httpOnly?: boolean
      sameSite?: CookieSameSite
      expires?: TimeSinceEpoch
    }
    /** Authorization challenge for HTTP status code 401 or 407. */
    export type AuthChallenge = { source?: 'Server' | 'Proxy'; origin: string; scheme: string; realm: string }
    /** Response to an AuthChallenge. */
    export type AuthChallengeResponse = {
      response: 'Default' | 'CancelAuth' | 'ProvideCredentials'
      username?: string
      password?: string
    }
    /** Stages of the interception to begin intercepting. Request will intercept before the request is sent. Response will intercept after the response is received. */
    export type InterceptionStage = 'Request' | 'HeadersReceived'
    /** Request pattern for interception. */
    export type RequestPattern = {
      urlPattern?: string
      resourceType?: ResourceType
      interceptionStage?: InterceptionStage
    }
    /** Information about a signed exchange signature. https://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#rfc.section.3.1 */
    export type SignedExchangeSignature = {
      label: string
      signature: string
      integrity: string
      certUrl?: string
      certSha256?: string
      validityUrl: string
      date: number
      expires: number
      certificates?: string[]
    }
    /** Information about a signed exchange header. https://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#cbor-representation */
    export type SignedExchangeHeader = {
      requestUrl: string
      responseCode: number
      responseHeaders: Headers
      signatures: SignedExchangeSignature[]
      headerIntegrity: string
    }
    /** Field type for a signed exchange related error. */
    export type SignedExchangeErrorField = 'signatureSig' | 'signatureIntegrity' | 'signatureCertUrl' | 'signatureCertSha256' | 'signatureValidityUrl' | 'signatureTimestamps'
    /** Information about a signed exchange response. */
    export type SignedExchangeError = {
      message: string
      signatureIndex?: number
      errorField?: SignedExchangeErrorField
    }
    /** Information about a signed exchange response. */
    export type SignedExchangeInfo = {
      outerResponse: Response
      header?: SignedExchangeHeader
      securityDetails?: SecurityDetails
      errors?: SignedExchangeError[]
    }
    export type DataReceivedEvent = {
      requestId: RequestId
      timestamp: MonotonicTime
      dataLength: number
      encodedDataLength: number
    }
    export type EventSourceMessageReceivedEvent = {
      requestId: RequestId
      timestamp: MonotonicTime
      eventName: string
      eventId: string
      data: string
    }
    export type LoadingFailedEvent = {
      requestId: RequestId
      timestamp: MonotonicTime
      type: ResourceType
      errorText: string
      canceled?: boolean
      blockedReason?: BlockedReason
    }
    export type LoadingFinishedEvent = {
      requestId: RequestId
      timestamp: MonotonicTime
      encodedDataLength: number
      shouldReportCorbBlocking?: boolean
    }
    export type RequestInterceptedEvent = {
      interceptionId: InterceptionId
      request: Request
      frameId: Page.FrameId
      resourceType: ResourceType
      isNavigationRequest: boolean
      isDownload?: boolean
      redirectUrl?: string
      authChallenge?: AuthChallenge
      responseErrorReason?: ErrorReason
      responseStatusCode?: number
      responseHeaders?: Headers
      requestId?: RequestId
    }
    export type RequestServedFromCacheEvent = { requestId: RequestId }
    export type RequestWillBeSentEvent = {
      requestId: RequestId
      loaderId: LoaderId
      documentURL: string
      request: Request
      timestamp: MonotonicTime
      wallTime: TimeSinceEpoch
      initiator: Initiator
      redirectResponse?: Response
      type?: ResourceType
      frameId?: Page.FrameId
      hasUserGesture?: boolean
    }
    export type ResourceChangedPriorityEvent = {
      requestId: RequestId
      newPriority: ResourcePriority
      timestamp: MonotonicTime
    }
    export type SignedExchangeReceivedEvent = { requestId: RequestId; info: SignedExchangeInfo }
    export type ResponseReceivedEvent = {
      requestId: RequestId
      loaderId: LoaderId
      timestamp: MonotonicTime
      type: ResourceType
      response: Response
      frameId?: Page.FrameId
    }
    export type WebSocketClosedEvent = { requestId: RequestId; timestamp: MonotonicTime }
    export type WebSocketCreatedEvent = { requestId: RequestId; url: string; initiator?: Initiator }
    export type WebSocketFrameErrorEvent = { requestId: RequestId; timestamp: MonotonicTime; errorMessage: string }
    export type WebSocketFrameReceivedEvent = {
      requestId: RequestId
      timestamp: MonotonicTime
      response: WebSocketFrame
    }
    export type WebSocketFrameSentEvent = { requestId: RequestId; timestamp: MonotonicTime; response: WebSocketFrame }
    export type WebSocketHandshakeResponseReceivedEvent = {
      requestId: RequestId
      timestamp: MonotonicTime
      response: WebSocketResponse
    }
    export type WebSocketWillSendHandshakeRequestEvent = {
      requestId: RequestId
      timestamp: MonotonicTime
      wallTime: TimeSinceEpoch
      request: WebSocketRequest
    }
    export type CanClearBrowserCacheRequest = {}
    export type CanClearBrowserCacheResponse = { result: boolean }
    export type CanClearBrowserCookiesRequest = {}
    export type CanClearBrowserCookiesResponse = { result: boolean }
    export type CanEmulateNetworkConditionsRequest = {}
    export type CanEmulateNetworkConditionsResponse = { result: boolean }
    export type ClearBrowserCacheRequest = {}
    export type ClearBrowserCacheResponse = {}
    export type ClearBrowserCookiesRequest = {}
    export type ClearBrowserCookiesResponse = {}
    export type ContinueInterceptedRequestRequest = {
      interceptionId: InterceptionId
      errorReason?: ErrorReason
      rawResponse?: string
      url?: string
      method?: string
      postData?: string
      headers?: Headers
      authChallengeResponse?: AuthChallengeResponse
    }
    export type ContinueInterceptedRequestResponse = {}
    export type DeleteCookiesRequest = { name: string; url?: string; domain?: string; path?: string }
    export type DeleteCookiesResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EmulateNetworkConditionsRequest = {
      offline: boolean
      latency: number
      downloadThroughput: number
      uploadThroughput: number
      connectionType?: ConnectionType
    }
    export type EmulateNetworkConditionsResponse = {}
    export type EnableRequest = {
      maxTotalBufferSize?: number
      maxResourceBufferSize?: number
      maxPostDataSize?: number
    }
    export type EnableResponse = {}
    export type GetAllCookiesRequest = {}
    export type GetAllCookiesResponse = { cookies: Cookie[] }
    export type GetCertificateRequest = { origin: string }
    export type GetCertificateResponse = { tableNames: string[] }
    export type GetCookiesRequest = { urls?: string[] }
    export type GetCookiesResponse = { cookies: Cookie[] }
    export type GetResponseBodyRequest = { requestId: RequestId }
    export type GetResponseBodyResponse = { body: string; base64Encoded: boolean }
    export type GetRequestPostDataRequest = { requestId: RequestId }
    export type GetRequestPostDataResponse = { postData: string }
    export type GetResponseBodyForInterceptionRequest = { interceptionId: InterceptionId }
    export type GetResponseBodyForInterceptionResponse = { body: string; base64Encoded: boolean }
    export type TakeResponseBodyForInterceptionAsStreamRequest = { interceptionId: InterceptionId }
    export type TakeResponseBodyForInterceptionAsStreamResponse = { stream: IO.StreamHandle }
    export type ReplayXHRRequest = { requestId: RequestId }
    export type ReplayXHRResponse = {}
    export type SearchInResponseBodyRequest = {
      requestId: RequestId
      query: string
      caseSensitive?: boolean
      isRegex?: boolean
    }
    export type SearchInResponseBodyResponse = { result: Debugger.SearchMatch[] }
    export type SetBlockedURLsRequest = { urls: string[] }
    export type SetBlockedURLsResponse = {}
    export type SetBypassServiceWorkerRequest = { bypass: boolean }
    export type SetBypassServiceWorkerResponse = {}
    export type SetCacheDisabledRequest = { cacheDisabled: boolean }
    export type SetCacheDisabledResponse = {}
    export type SetCookieRequest = {
      name: string
      value: string
      url?: string
      domain?: string
      path?: string
      secure?: boolean
      httpOnly?: boolean
      sameSite?: CookieSameSite
      expires?: TimeSinceEpoch
    }
    export type SetCookieResponse = { success: boolean }
    export type SetCookiesRequest = { cookies: CookieParam[] }
    export type SetCookiesResponse = {}
    export type SetDataSizeLimitsForTestRequest = { maxTotalSize: number; maxResourceSize: number }
    export type SetDataSizeLimitsForTestResponse = {}
    export type SetExtraHTTPHeadersRequest = { headers: Headers }
    export type SetExtraHTTPHeadersResponse = {}
    export type SetRequestInterceptionRequest = { patterns: RequestPattern[] }
    export type SetRequestInterceptionResponse = {}
    export type SetUserAgentOverrideRequest = { userAgent: string; acceptLanguage?: string; platform?: string }
    export type SetUserAgentOverrideResponse = {}
  }
  export namespace Overlay {
    /** Configuration data for the highlighting of page elements. */
    export type HighlightConfig = {
      showInfo?: boolean
      showStyles?: boolean
      showRulers?: boolean
      showExtensionLines?: boolean
      contentColor?: DOM.RGBA
      paddingColor?: DOM.RGBA
      borderColor?: DOM.RGBA
      marginColor?: DOM.RGBA
      eventTargetColor?: DOM.RGBA
      shapeColor?: DOM.RGBA
      shapeMarginColor?: DOM.RGBA
      cssGridColor?: DOM.RGBA
    }

    export type InspectMode = 'searchForNode' | 'searchForUAShadowDOM' | 'captureAreaScreenshot' | 'showDistances' | 'none'
    export type InspectNodeRequestedEvent = { backendNodeId: DOM.BackendNodeId }
    export type NodeHighlightRequestedEvent = { nodeId: DOM.NodeId }
    export type ScreenshotRequestedEvent = { viewport: Page.Viewport }
    export type InspectModeCanceledEvent = { [key: string]: any }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetHighlightObjectForTestRequest = {
      nodeId: DOM.NodeId
      includeDistance?: boolean
      includeStyle?: boolean
    }
    export type GetHighlightObjectForTestResponse = { highlight: { [key: string]: any } }
    export type HideHighlightRequest = {}
    export type HideHighlightResponse = {}
    export type HighlightFrameRequest = {
      frameId: Page.FrameId
      contentColor?: DOM.RGBA
      contentOutlineColor?: DOM.RGBA
    }
    export type HighlightFrameResponse = {}
    export type HighlightNodeRequest = {
      highlightConfig: HighlightConfig
      nodeId?: DOM.NodeId
      backendNodeId?: DOM.BackendNodeId
      objectId?: Runtime.RemoteObjectId
      selector?: string
    }
    export type HighlightNodeResponse = {}
    export type HighlightQuadRequest = { quad: DOM.Quad; color?: DOM.RGBA; outlineColor?: DOM.RGBA }
    export type HighlightQuadResponse = {}
    export type HighlightRectRequest = {
      x: number
      y: number
      width: number
      height: number
      color?: DOM.RGBA
      outlineColor?: DOM.RGBA
    }
    export type HighlightRectResponse = {}
    export type SetInspectModeRequest = { mode: InspectMode; highlightConfig?: HighlightConfig }
    export type SetInspectModeResponse = {}
    export type SetShowAdHighlightsRequest = { show: boolean }
    export type SetShowAdHighlightsResponse = {}
    export type SetPausedInDebuggerMessageRequest = { message?: string }
    export type SetPausedInDebuggerMessageResponse = {}
    export type SetShowDebugBordersRequest = { show: boolean }
    export type SetShowDebugBordersResponse = {}
    export type SetShowFPSCounterRequest = { show: boolean }
    export type SetShowFPSCounterResponse = {}
    export type SetShowPaintRectsRequest = { result: boolean }
    export type SetShowPaintRectsResponse = {}
    export type SetShowLayoutShiftRegionsRequest = { result: boolean }
    export type SetShowLayoutShiftRegionsResponse = {}
    export type SetShowScrollBottleneckRectsRequest = { show: boolean }
    export type SetShowScrollBottleneckRectsResponse = {}
    export type SetShowHitTestBordersRequest = { show: boolean }
    export type SetShowHitTestBordersResponse = {}
    export type SetShowViewportSizeOnResizeRequest = { show: boolean }
    export type SetShowViewportSizeOnResizeResponse = {}
  }
  export namespace Page {
    /** Unique frame identifier. */
    export type FrameId = string
    /** Information about the Frame on the page. */
    export type Frame = {
      id: string
      parentId?: string
      loaderId: Network.LoaderId
      name?: string
      url: string
      urlFragment?: string
      securityOrigin: string
      mimeType: string
      unreachableUrl?: string
    }
    /** Information about the Resource on the page. */
    export type FrameResource = {
      url: string
      type: Network.ResourceType
      mimeType: string
      lastModified?: Network.TimeSinceEpoch
      contentSize?: number
      failed?: boolean
      canceled?: boolean
    }
    /** Information about the Frame hierarchy along with their cached resources. */
    export type FrameResourceTree = { frame: Frame; childFrames?: FrameResourceTree[]; resources: FrameResource[] }
    /** Information about the Frame hierarchy. */
    export type FrameTree = { frame: Frame; childFrames?: FrameTree[] }
    /** Unique script identifier. */
    export type ScriptIdentifier = string
    /** Transition type. */
    export type TransitionType =
      | 'link'
      | 'typed'
      | 'address_bar'
      | 'auto_bookmark'
      | 'auto_subframe'
      | 'manual_subframe'
      | 'generated'
      | 'auto_toplevel'
      | 'form_submit'
      | 'reload'
      | 'keyword'
      | 'keyword_generated'
      | 'other'
    /** Navigation history entry. */
    export type NavigationEntry = {
      id: number
      url: string
      userTypedURL: string
      title: string
      transitionType: TransitionType
    }
    /** Screencast frame metadata. */
    export type ScreencastFrameMetadata = {
      offsetTop: number
      pageScaleFactor: number
      deviceWidth: number
      deviceHeight: number
      scrollOffsetX: number
      scrollOffsetY: number
      timestamp?: Network.TimeSinceEpoch
    }
    /** Javascript dialog type. */
    export type DialogType = 'alert' | 'confirm' | 'prompt' | 'beforeunload'
    /** Error while paring app manifest. */
    export type AppManifestError = { message: string; critical: number; line: number; column: number }
    /** Layout viewport position and dimensions. */
    export type LayoutViewport = { pageX: number; pageY: number; clientWidth: number; clientHeight: number }
    /** Visual viewport position, dimensions, and scale. */
    export type VisualViewport = {
      offsetX: number
      offsetY: number
      pageX: number
      pageY: number
      clientWidth: number
      clientHeight: number
      scale: number
      zoom?: number
    }
    /** Viewport for capturing screenshot. */
    export type Viewport = { x: number; y: number; width: number; height: number; scale: number }
    /** Generic font families collection. */
    export type FontFamilies = {
      standard?: string
      fixed?: string
      serif?: string
      sansSerif?: string
      cursive?: string
      fantasy?: string
      pictograph?: string
    }
    /** Default font sizes. */
    export type FontSizes = { standard?: number; fixed?: number }

    export type ClientNavigationReason =
      | 'formSubmissionGet'
      | 'formSubmissionPost'
      | 'httpHeaderRefresh'
      | 'scriptInitiated'
      | 'metaTagRefresh'
      | 'pageBlockInterstitial'
      | 'reload'
    export type DomContentEventFiredEvent = { timestamp: Network.MonotonicTime }
    export type FileChooserOpenedEvent = { mode: 'selectSingle' | 'selectMultiple' }
    export type FrameAttachedEvent = { frameId: FrameId; parentFrameId: FrameId; stack?: Runtime.StackTrace }
    export type FrameClearedScheduledNavigationEvent = { frameId: FrameId }
    export type FrameDetachedEvent = { frameId: FrameId }
    export type FrameNavigatedEvent = { frame: Frame }
    export type FrameResizedEvent = { [key: string]: any }
    export type FrameRequestedNavigationEvent = { frameId: FrameId; reason: ClientNavigationReason; url: string }
    export type FrameScheduledNavigationEvent = {
      frameId: FrameId
      delay: number
      reason: 'formSubmissionGet' | 'formSubmissionPost' | 'httpHeaderRefresh' | 'scriptInitiated' | 'metaTagRefresh' | 'pageBlockInterstitial' | 'reload'
      url: string
    }
    export type FrameStartedLoadingEvent = { frameId: FrameId }
    export type FrameStoppedLoadingEvent = { frameId: FrameId }
    export type DownloadWillBeginEvent = { frameId: FrameId; url: string }
    export type InterstitialHiddenEvent = { [key: string]: any }
    export type InterstitialShownEvent = { [key: string]: any }
    export type JavascriptDialogClosedEvent = { result: boolean; userInput: string }
    export type JavascriptDialogOpeningEvent = {
      url: string
      message: string
      type: DialogType
      hasBrowserHandler: boolean
      defaultPrompt?: string
    }
    export type LifecycleEventEvent = {
      frameId: FrameId
      loaderId: Network.LoaderId
      name: string
      timestamp: Network.MonotonicTime
    }
    export type LoadEventFiredEvent = { timestamp: Network.MonotonicTime }
    export type NavigatedWithinDocumentEvent = { frameId: FrameId; url: string }
    export type ScreencastFrameEvent = { data: string; metadata: ScreencastFrameMetadata; sessionId: number }
    export type ScreencastVisibilityChangedEvent = { visible: boolean }
    export type WindowOpenEvent = { url: string; windowName: string; windowFeatures: string[]; userGesture: boolean }
    export type CompilationCacheProducedEvent = { url: string; data: string }
    export type AddScriptToEvaluateOnLoadRequest = { scriptSource: string }
    export type AddScriptToEvaluateOnLoadResponse = { identifier: ScriptIdentifier }
    export type AddScriptToEvaluateOnNewDocumentRequest = { source: string; worldName?: string }
    export type AddScriptToEvaluateOnNewDocumentResponse = { identifier: ScriptIdentifier }
    export type BringToFrontRequest = {}
    export type BringToFrontResponse = {}
    export type CaptureScreenshotRequest = {
      format?: 'jpeg' | 'png'
      quality?: number
      clip?: Viewport
      fromSurface?: boolean
    }
    export type CaptureScreenshotResponse = { data: string }
    export type CaptureSnapshotRequest = { format?: 'mhtml' }
    export type CaptureSnapshotResponse = { data: string }
    export type ClearDeviceMetricsOverrideRequest = {}
    export type ClearDeviceMetricsOverrideResponse = {}
    export type ClearDeviceOrientationOverrideRequest = {}
    export type ClearDeviceOrientationOverrideResponse = {}
    export type ClearGeolocationOverrideRequest = {}
    export type ClearGeolocationOverrideResponse = {}
    export type CreateIsolatedWorldRequest = { frameId: FrameId; worldName?: string; grantUniveralAccess?: boolean }
    export type CreateIsolatedWorldResponse = { executionContextId: Runtime.ExecutionContextId }
    export type DeleteCookieRequest = { cookieName: string; url: string }
    export type DeleteCookieResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetAppManifestRequest = {}
    export type GetAppManifestResponse = { url: string; errors: AppManifestError[]; data?: string }
    export type GetInstallabilityErrorsRequest = {}
    export type GetInstallabilityErrorsResponse = { errors: string[] }
    export type GetCookiesRequest = {}
    export type GetCookiesResponse = { cookies: Network.Cookie[] }
    export type GetFrameTreeRequest = {}
    export type GetFrameTreeResponse = { frameTree: FrameTree }
    export type GetLayoutMetricsRequest = {}
    export type GetLayoutMetricsResponse = {
      layoutViewport: LayoutViewport
      visualViewport: VisualViewport
      contentSize: DOM.Rect
    }
    export type GetNavigationHistoryRequest = {}
    export type GetNavigationHistoryResponse = { currentIndex: number; entries: NavigationEntry[] }
    export type ResetNavigationHistoryRequest = {}
    export type ResetNavigationHistoryResponse = {}
    export type GetResourceContentRequest = { frameId: FrameId; url: string }
    export type GetResourceContentResponse = { content: string; base64Encoded: boolean }
    export type GetResourceTreeRequest = {}
    export type GetResourceTreeResponse = { frameTree: FrameResourceTree }
    export type HandleJavaScriptDialogRequest = { accept: boolean; promptText?: string }
    export type HandleJavaScriptDialogResponse = {}
    export type NavigateRequest = { url: string; referrer?: string; transitionType?: TransitionType; frameId?: FrameId }
    export type NavigateResponse = { frameId: FrameId; loaderId?: Network.LoaderId; errorText?: string }
    export type NavigateToHistoryEntryRequest = { entryId: number }
    export type NavigateToHistoryEntryResponse = {}
    export type PrintToPDFRequest = {
      landscape?: boolean
      displayHeaderFooter?: boolean
      printBackground?: boolean
      scale?: number
      paperWidth?: number
      paperHeight?: number
      marginTop?: number
      marginBottom?: number
      marginLeft?: number
      marginRight?: number
      pageRanges?: string
      ignoreInvalidPageRanges?: boolean
      headerTemplate?: string
      footerTemplate?: string
      preferCSSPageSize?: boolean
      transferMode?: 'ReturnAsBase64' | 'ReturnAsStream'
    }
    export type PrintToPDFResponse = { data: string; stream?: IO.StreamHandle }
    export type ReloadRequest = { ignoreCache?: boolean; scriptToEvaluateOnLoad?: string }
    export type ReloadResponse = {}
    export type RemoveScriptToEvaluateOnLoadRequest = { identifier: ScriptIdentifier }
    export type RemoveScriptToEvaluateOnLoadResponse = {}
    export type RemoveScriptToEvaluateOnNewDocumentRequest = { identifier: ScriptIdentifier }
    export type RemoveScriptToEvaluateOnNewDocumentResponse = {}
    export type ScreencastFrameAckRequest = { sessionId: number }
    export type ScreencastFrameAckResponse = {}
    export type SearchInResourceRequest = {
      frameId: FrameId
      url: string
      query: string
      caseSensitive?: boolean
      isRegex?: boolean
    }
    export type SearchInResourceResponse = { result: Debugger.SearchMatch[] }
    export type SetAdBlockingEnabledRequest = { enabled: boolean }
    export type SetAdBlockingEnabledResponse = {}
    export type SetBypassCSPRequest = { enabled: boolean }
    export type SetBypassCSPResponse = {}
    export type SetDeviceMetricsOverrideRequest = {
      width: number
      height: number
      deviceScaleFactor: number
      mobile: boolean
      scale?: number
      screenWidth?: number
      screenHeight?: number
      positionX?: number
      positionY?: number
      dontSetVisibleSize?: boolean
      screenOrientation?: Emulation.ScreenOrientation
      viewport?: Viewport
    }
    export type SetDeviceMetricsOverrideResponse = {}
    export type SetDeviceOrientationOverrideRequest = { alpha: number; beta: number; gamma: number }
    export type SetDeviceOrientationOverrideResponse = {}
    export type SetFontFamiliesRequest = { fontFamilies: FontFamilies }
    export type SetFontFamiliesResponse = {}
    export type SetFontSizesRequest = { fontSizes: FontSizes }
    export type SetFontSizesResponse = {}
    export type SetDocumentContentRequest = { frameId: FrameId; html: string }
    export type SetDocumentContentResponse = {}
    export type SetDownloadBehaviorRequest = { behavior: 'deny' | 'allow' | 'default'; downloadPath?: string }
    export type SetDownloadBehaviorResponse = {}
    export type SetGeolocationOverrideRequest = { latitude?: number; longitude?: number; accuracy?: number }
    export type SetGeolocationOverrideResponse = {}
    export type SetLifecycleEventsEnabledRequest = { enabled: boolean }
    export type SetLifecycleEventsEnabledResponse = {}
    export type SetTouchEmulationEnabledRequest = { enabled: boolean; configuration?: 'mobile' | 'desktop' }
    export type SetTouchEmulationEnabledResponse = {}
    export type StartScreencastRequest = {
      format?: 'jpeg' | 'png'
      quality?: number
      maxWidth?: number
      maxHeight?: number
      everyNthFrame?: number
    }
    export type StartScreencastResponse = {}
    export type StopLoadingRequest = {}
    export type StopLoadingResponse = {}
    export type CrashRequest = {}
    export type CrashResponse = {}
    export type CloseRequest = {}
    export type CloseResponse = {}
    export type SetWebLifecycleStateRequest = { state: 'frozen' | 'active' }
    export type SetWebLifecycleStateResponse = {}
    export type StopScreencastRequest = {}
    export type StopScreencastResponse = {}
    export type SetProduceCompilationCacheRequest = { enabled: boolean }
    export type SetProduceCompilationCacheResponse = {}
    export type AddCompilationCacheRequest = { url: string; data: string }
    export type AddCompilationCacheResponse = {}
    export type ClearCompilationCacheRequest = {}
    export type ClearCompilationCacheResponse = {}
    export type GenerateTestReportRequest = { message: string; group?: string }
    export type GenerateTestReportResponse = {}
    export type WaitForDebuggerRequest = {}
    export type WaitForDebuggerResponse = {}
    export type SetInterceptFileChooserDialogRequest = { enabled: boolean }
    export type SetInterceptFileChooserDialogResponse = {}
    export type HandleFileChooserRequest = { action: 'accept' | 'cancel' | 'fallback'; files?: string[] }
    export type HandleFileChooserResponse = {}
  }
  export namespace Performance {
    /** Run-time execution metric. */
    export type Metric = { name: string; value: number }
    export type MetricsEvent = { metrics: Metric[]; title: string }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type SetTimeDomainRequest = { timeDomain: 'timeTicks' | 'threadTicks' }
    export type SetTimeDomainResponse = {}
    export type GetMetricsRequest = {}
    export type GetMetricsResponse = { metrics: Metric[] }
  }
  export namespace Security {
    /** An internal certificate ID value. */
    export type CertificateId = number
    /** A description of mixed content (HTTP resources on HTTPS pages), as defined by https://www.w3.org/TR/mixed-content/#categories */
    export type MixedContentType = 'blockable' | 'optionally-blockable' | 'none'
    /** The security level of a page or resource. */
    export type SecurityState = 'unknown' | 'neutral' | 'insecure' | 'secure' | 'info'
    /** An explanation of an factor contributing to the security state. */
    export type SecurityStateExplanation = {
      securityState: SecurityState
      title: string
      summary: string
      description: string
      mixedContentType: MixedContentType
      certificate: string[]
      recommendations?: string[]
    }
    /** Information about insecure content on the page. */
    export type InsecureContentStatus = {
      ranMixedContent: boolean
      displayedMixedContent: boolean
      containedMixedForm: boolean
      ranContentWithCertErrors: boolean
      displayedContentWithCertErrors: boolean
      ranInsecureContentStyle: SecurityState
      displayedInsecureContentStyle: SecurityState
    }
    /** The action to take when a certificate error occurs. continue will continue processing the request and cancel will cancel the request. */
    export type CertificateErrorAction = 'continue' | 'cancel'
    export type CertificateErrorEvent = { eventId: number; errorType: string; requestURL: string }
    export type SecurityStateChangedEvent = {
      securityState: SecurityState
      schemeIsCryptographic: boolean
      explanations: SecurityStateExplanation[]
      insecureContentStatus: InsecureContentStatus
      summary?: string
    }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type SetIgnoreCertificateErrorsRequest = { ignore: boolean }
    export type SetIgnoreCertificateErrorsResponse = {}
    export type HandleCertificateErrorRequest = { eventId: number; action: CertificateErrorAction }
    export type HandleCertificateErrorResponse = {}
    export type SetOverrideCertificateErrorsRequest = { override: boolean }
    export type SetOverrideCertificateErrorsResponse = {}
  }
  export namespace ServiceWorker {
    export type RegistrationID = string
    /** ServiceWorker registration. */
    export type ServiceWorkerRegistration = { registrationId: RegistrationID; scopeURL: string; isDeleted: boolean }

    export type ServiceWorkerVersionRunningStatus = 'stopped' | 'starting' | 'running' | 'stopping'

    export type ServiceWorkerVersionStatus = 'new' | 'installing' | 'installed' | 'activating' | 'activated' | 'redundant'
    /** ServiceWorker version. */
    export type ServiceWorkerVersion = {
      versionId: string
      registrationId: RegistrationID
      scriptURL: string
      runningStatus: ServiceWorkerVersionRunningStatus
      status: ServiceWorkerVersionStatus
      scriptLastModified?: number
      scriptResponseTime?: number
      controlledClients?: Target.TargetID[]
      targetId?: Target.TargetID
    }
    /** ServiceWorker error message. */
    export type ServiceWorkerErrorMessage = {
      errorMessage: string
      registrationId: RegistrationID
      versionId: string
      sourceURL: string
      lineNumber: number
      columnNumber: number
    }
    export type WorkerErrorReportedEvent = { errorMessage: ServiceWorkerErrorMessage }
    export type WorkerRegistrationUpdatedEvent = { registrations: ServiceWorkerRegistration[] }
    export type WorkerVersionUpdatedEvent = { versions: ServiceWorkerVersion[] }
    export type DeliverPushMessageRequest = { origin: string; registrationId: RegistrationID; data: string }
    export type DeliverPushMessageResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type DispatchSyncEventRequest = {
      origin: string
      registrationId: RegistrationID
      tag: string
      lastChance: boolean
    }
    export type DispatchSyncEventResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type InspectWorkerRequest = { versionId: string }
    export type InspectWorkerResponse = {}
    export type SetForceUpdateOnPageLoadRequest = { forceUpdateOnPageLoad: boolean }
    export type SetForceUpdateOnPageLoadResponse = {}
    export type SkipWaitingRequest = { scopeURL: string }
    export type SkipWaitingResponse = {}
    export type StartWorkerRequest = { scopeURL: string }
    export type StartWorkerResponse = {}
    export type StopAllWorkersRequest = {}
    export type StopAllWorkersResponse = {}
    export type StopWorkerRequest = { versionId: string }
    export type StopWorkerResponse = {}
    export type UnregisterRequest = { scopeURL: string }
    export type UnregisterResponse = {}
    export type UpdateRegistrationRequest = { scopeURL: string }
    export type UpdateRegistrationResponse = {}
  }
  export namespace Storage {
    /** Enum of possible storage types. */
    export type StorageType =
      | 'appcache'
      | 'cookies'
      | 'file_systems'
      | 'indexeddb'
      | 'local_storage'
      | 'shader_cache'
      | 'websql'
      | 'service_workers'
      | 'cache_storage'
      | 'all'
      | 'other'
    /** Usage for a storage type. */
    export type UsageForType = { storageType: StorageType; usage: number }
    export type CacheStorageContentUpdatedEvent = { origin: string; cacheName: string }
    export type CacheStorageListUpdatedEvent = { origin: string }
    export type IndexedDBContentUpdatedEvent = { origin: string; databaseName: string; objectStoreName: string }
    export type IndexedDBListUpdatedEvent = { origin: string }
    export type ClearDataForOriginRequest = { origin: string; storageTypes: string }
    export type ClearDataForOriginResponse = {}
    export type GetUsageAndQuotaRequest = { origin: string }
    export type GetUsageAndQuotaResponse = { usage: number; quota: number; usageBreakdown: UsageForType[] }
    export type TrackCacheStorageForOriginRequest = { origin: string }
    export type TrackCacheStorageForOriginResponse = {}
    export type TrackIndexedDBForOriginRequest = { origin: string }
    export type TrackIndexedDBForOriginResponse = {}
    export type UntrackCacheStorageForOriginRequest = { origin: string }
    export type UntrackCacheStorageForOriginResponse = {}
    export type UntrackIndexedDBForOriginRequest = { origin: string }
    export type UntrackIndexedDBForOriginResponse = {}
  }
  export namespace SystemInfo {
    /** Describes a single graphics processor (GPU). */
    export type GPUDevice = {
      vendorId: number
      deviceId: number
      vendorString: string
      deviceString: string
      driverVendor: string
      driverVersion: string
    }
    /** Describes the width and height dimensions of an entity. */
    export type Size = { width: number; height: number }
    /** Describes a supported video decoding profile with its associated minimum and maximum resolutions. */
    export type VideoDecodeAcceleratorCapability = { profile: string; maxResolution: Size; minResolution: Size }
    /** Describes a supported video encoding profile with its associated maximum resolution and maximum framerate. */
    export type VideoEncodeAcceleratorCapability = {
      profile: string
      maxResolution: Size
      maxFramerateNumerator: number
      maxFramerateDenominator: number
    }
    /** YUV subsampling type of the pixels of a given image. */
    export type SubsamplingFormat = 'yuv420' | 'yuv422' | 'yuv444'
    /** Describes a supported image decoding profile with its associated minimum and maximum resolutions and subsampling. */
    export type ImageDecodeAcceleratorCapability = {
      imageType: string
      maxDimensions: Size
      minDimensions: Size
      subsamplings: SubsamplingFormat[]
    }
    /** Provides information about the GPU(s) on the system. */
    export type GPUInfo = {
      devices: GPUDevice[]
      auxAttributes?: { [key: string]: any }
      featureStatus?: { [key: string]: any }
      driverBugWorkarounds: string[]
      videoDecoding: VideoDecodeAcceleratorCapability[]
      videoEncoding: VideoEncodeAcceleratorCapability[]
      imageDecoding: ImageDecodeAcceleratorCapability[]
    }
    /** Represents process info. */
    export type ProcessInfo = { type: string; id: number; cpuTime: number }
    export type GetInfoRequest = {}
    export type GetInfoResponse = { gpu: GPUInfo; modelName: string; modelVersion: string; commandLine: string }
    export type GetProcessInfoRequest = {}
    export type GetProcessInfoResponse = { processInfo: ProcessInfo[] }
  }
  export namespace Target {
    export type TargetID = string
    /** Unique identifier of attached debugging session. */
    export type SessionID = string

    export type BrowserContextID = string

    export type TargetInfo = {
      targetId: TargetID
      type: string
      title: string
      url: string
      attached: boolean
      openerId?: TargetID
      browserContextId?: BrowserContextID
    }

    export type RemoteLocation = { host: string; port: number }
    export type AttachedToTargetEvent = { sessionId: SessionID; targetInfo: TargetInfo; waitingForDebugger: boolean }
    export type DetachedFromTargetEvent = { sessionId: SessionID; targetId?: TargetID }
    export type ReceivedMessageFromTargetEvent = { sessionId: SessionID; message: string; targetId?: TargetID }
    export type TargetCreatedEvent = { targetInfo: TargetInfo }
    export type TargetDestroyedEvent = { targetId: TargetID }
    export type TargetCrashedEvent = { targetId: TargetID; status: string; errorCode: number }
    export type TargetInfoChangedEvent = { targetInfo: TargetInfo }
    export type ActivateTargetRequest = { targetId: TargetID }
    export type ActivateTargetResponse = {}
    export type AttachToTargetRequest = { targetId: TargetID; flatten?: boolean }
    export type AttachToTargetResponse = { sessionId: SessionID }
    export type AttachToBrowserTargetRequest = {}
    export type AttachToBrowserTargetResponse = { sessionId: SessionID }
    export type CloseTargetRequest = { targetId: TargetID }
    export type CloseTargetResponse = { success: boolean }
    export type ExposeDevToolsProtocolRequest = { targetId: TargetID; bindingName?: string }
    export type ExposeDevToolsProtocolResponse = {}
    export type CreateBrowserContextRequest = {}
    export type CreateBrowserContextResponse = { browserContextId: BrowserContextID }
    export type GetBrowserContextsRequest = {}
    export type GetBrowserContextsResponse = { browserContextIds: BrowserContextID[] }
    export type CreateTargetRequest = {
      url: string
      width?: number
      height?: number
      browserContextId?: BrowserContextID
      enableBeginFrameControl?: boolean
      newWindow?: boolean
      background?: boolean
    }
    export type CreateTargetResponse = { targetId: TargetID }
    export type DetachFromTargetRequest = { sessionId?: SessionID; targetId?: TargetID }
    export type DetachFromTargetResponse = {}
    export type DisposeBrowserContextRequest = { browserContextId: BrowserContextID }
    export type DisposeBrowserContextResponse = {}
    export type GetTargetInfoRequest = { targetId?: TargetID }
    export type GetTargetInfoResponse = { targetInfo: TargetInfo }
    export type GetTargetsRequest = {}
    export type GetTargetsResponse = { targetInfos: TargetInfo[] }
    export type SendMessageToTargetRequest = { message: string; sessionId?: SessionID; targetId?: TargetID }
    export type SendMessageToTargetResponse = {}
    export type SetAutoAttachRequest = { autoAttach: boolean; waitForDebuggerOnStart: boolean; flatten?: boolean }
    export type SetAutoAttachResponse = {}
    export type SetDiscoverTargetsRequest = { discover: boolean }
    export type SetDiscoverTargetsResponse = {}
    export type SetRemoteLocationsRequest = { locations: RemoteLocation[] }
    export type SetRemoteLocationsResponse = {}
  }
  export namespace Tethering {
    export type AcceptedEvent = { port: number; connectionId: string }
    export type BindRequest = { port: number }
    export type BindResponse = {}
    export type UnbindRequest = { port: number }
    export type UnbindResponse = {}
  }
  export namespace Tracing {
    /** Configuration for memory dump. Used only when "memory-infra" category is enabled. */
    export type MemoryDumpConfig = { [key: string]: any }

    export type TraceConfig = {
      recordMode?: 'recordUntilFull' | 'recordContinuously' | 'recordAsMuchAsPossible' | 'echoToConsole'
      enableSampling?: boolean
      enableSystrace?: boolean
      enableArgumentFilter?: boolean
      includedCategories?: string[]
      excludedCategories?: string[]
      syntheticDelays?: string[]
      memoryDumpConfig?: MemoryDumpConfig
    }
    /** Data format of a trace. Can be either the legacy JSON format or the protocol buffer format. Note that the JSON format will be deprecated soon. */
    export type StreamFormat = 'json' | 'proto'
    /** Compression type to use for traces returned via streams. */
    export type StreamCompression = 'none' | 'gzip'
    export type BufferUsageEvent = { percentFull?: number; eventCount?: number; value?: number }
    export type DataCollectedEvent = { value: { [key: string]: any }[] }
    export type TracingCompleteEvent = {
      dataLossOccurred: boolean
      stream?: IO.StreamHandle
      traceFormat?: StreamFormat
      streamCompression?: StreamCompression
    }
    export type EndRequest = {}
    export type EndResponse = {}
    export type GetCategoriesRequest = {}
    export type GetCategoriesResponse = { categories: string[] }
    export type RecordClockSyncMarkerRequest = { syncId: string }
    export type RecordClockSyncMarkerResponse = {}
    export type RequestMemoryDumpRequest = {}
    export type RequestMemoryDumpResponse = { dumpGuid: string; success: boolean }
    export type StartRequest = {
      categories?: string
      options?: string
      bufferUsageReportingInterval?: number
      transferMode?: 'ReportEvents' | 'ReturnAsStream'
      streamFormat?: StreamFormat
      streamCompression?: StreamCompression
      traceConfig?: TraceConfig
    }
    export type StartResponse = {}
  }
  export namespace Fetch {
    /** Unique request identifier. */
    export type RequestId = string
    /** Stages of the request to handle. Request will intercept before the request is sent. Response will intercept after the response is received (but before response body is received. */
    export type RequestStage = 'Request' | 'Response'

    export type RequestPattern = {
      urlPattern?: string
      resourceType?: Network.ResourceType
      requestStage?: RequestStage
    }
    /** Response HTTP header entry */
    export type HeaderEntry = { name: string; value: string }
    /** Authorization challenge for HTTP status code 401 or 407. */
    export type AuthChallenge = { source?: 'Server' | 'Proxy'; origin: string; scheme: string; realm: string }
    /** Response to an AuthChallenge. */
    export type AuthChallengeResponse = {
      response: 'Default' | 'CancelAuth' | 'ProvideCredentials'
      username?: string
      password?: string
    }
    export type RequestPausedEvent = {
      requestId: RequestId
      request: Network.Request
      frameId: Page.FrameId
      resourceType: Network.ResourceType
      responseErrorReason?: Network.ErrorReason
      responseStatusCode?: number
      responseHeaders?: HeaderEntry[]
      networkId?: RequestId
    }
    export type AuthRequiredEvent = {
      requestId: RequestId
      request: Network.Request
      frameId: Page.FrameId
      resourceType: Network.ResourceType
      authChallenge: AuthChallenge
    }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = { patterns?: RequestPattern[]; handleAuthRequests?: boolean }
    export type EnableResponse = {}
    export type FailRequestRequest = { requestId: RequestId; errorReason: Network.ErrorReason }
    export type FailRequestResponse = {}
    export type FulfillRequestRequest = {
      requestId: RequestId
      responseCode: number
      responseHeaders: HeaderEntry[]
      body?: string
      responsePhrase?: string
    }
    export type FulfillRequestResponse = {}
    export type ContinueRequestRequest = {
      requestId: RequestId
      url?: string
      method?: string
      postData?: string
      headers?: HeaderEntry[]
    }
    export type ContinueRequestResponse = {}
    export type ContinueWithAuthRequest = { requestId: RequestId; authChallengeResponse: AuthChallengeResponse }
    export type ContinueWithAuthResponse = {}
    export type GetResponseBodyRequest = { requestId: RequestId }
    export type GetResponseBodyResponse = { body: string; base64Encoded: boolean }
    export type TakeResponseBodyAsStreamRequest = { requestId: RequestId }
    export type TakeResponseBodyAsStreamResponse = { stream: IO.StreamHandle }
  }
  export namespace WebAudio {
    /** Context's UUID in string */
    export type ContextId = string
    /** Enum of BaseAudioContext types */
    export type ContextType = 'realtime' | 'offline'
    /** Enum of AudioContextState from the spec */
    export type ContextState = 'suspended' | 'running' | 'closed'
    /** Fields in AudioContext that change in real-time. */
    export type ContextRealtimeData = {
      currentTime: number
      renderCapacity: number
      callbackIntervalMean: number
      callbackIntervalVariance: number
    }
    /** Protocol object for BaseAudioContext */
    export type BaseAudioContext = {
      contextId: ContextId
      contextType: ContextType
      contextState: ContextState
      realtimeData?: ContextRealtimeData
      callbackBufferSize: number
      maxOutputChannelCount: number
      sampleRate: number
    }
    export type ContextCreatedEvent = { context: BaseAudioContext }
    export type ContextDestroyedEvent = { contextId: ContextId }
    export type ContextChangedEvent = { context: BaseAudioContext }
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type GetRealtimeDataRequest = { contextId: ContextId }
    export type GetRealtimeDataResponse = { realtimeData: ContextRealtimeData }
  }
  export namespace WebAuthn {
    export type AuthenticatorId = string

    export type AuthenticatorProtocol = 'u2f' | 'ctap2'

    export type AuthenticatorTransport = 'usb' | 'nfc' | 'ble' | 'cable' | 'internal'

    export type VirtualAuthenticatorOptions = {
      protocol: AuthenticatorProtocol
      transport: AuthenticatorTransport
      hasResidentKey: boolean
      hasUserVerification: boolean
      automaticPresenceSimulation?: boolean
    }

    export type Credential = { credentialId: string; rpIdHash: string; privateKey: string; signCount: number }
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type AddVirtualAuthenticatorRequest = { options: VirtualAuthenticatorOptions }
    export type AddVirtualAuthenticatorResponse = { authenticatorId: AuthenticatorId }
    export type RemoveVirtualAuthenticatorRequest = { authenticatorId: AuthenticatorId }
    export type RemoveVirtualAuthenticatorResponse = {}
    export type AddCredentialRequest = { authenticatorId: AuthenticatorId; credential: Credential }
    export type AddCredentialResponse = {}
    export type GetCredentialsRequest = { authenticatorId: AuthenticatorId }
    export type GetCredentialsResponse = { credentials: Credential[] }
    export type ClearCredentialsRequest = { authenticatorId: AuthenticatorId }
    export type ClearCredentialsResponse = {}
    export type SetUserVerifiedRequest = { authenticatorId: AuthenticatorId; isUserVerified: boolean }
    export type SetUserVerifiedResponse = {}
  }
  export namespace Console {
    /** Console message. */
    export type ConsoleMessage = {
      source: 'xml' | 'javascript' | 'network' | 'console-api' | 'storage' | 'appcache' | 'rendering' | 'security' | 'other' | 'deprecation' | 'worker'
      level: 'log' | 'warning' | 'error' | 'debug' | 'info'
      text: string
      url?: string
      line?: number
      column?: number
    }
    export type MessageAddedEvent = { message: ConsoleMessage }
    export type ClearMessagesRequest = {}
    export type ClearMessagesResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
  }
  export namespace Debugger {
    /** Breakpoint identifier. */
    export type BreakpointId = string
    /** Call frame identifier. */
    export type CallFrameId = string
    /** Location in the source code. */
    export type Location = { scriptId: Runtime.ScriptId; lineNumber: number; columnNumber?: number }
    /** Location in the source code. */
    export type ScriptPosition = { lineNumber: number; columnNumber: number }
    /** JavaScript call frame. Array of call frames form the call stack. */
    export type CallFrame = {
      callFrameId: CallFrameId
      functionName: string
      functionLocation?: Location
      location: Location
      url: string
      scopeChain: Scope[]
      this: Runtime.RemoteObject
      returnValue?: Runtime.RemoteObject
    }
    /** Scope description. */
    export type Scope = {
      type: 'global' | 'local' | 'with' | 'closure' | 'catch' | 'block' | 'script' | 'eval' | 'module'
      object: Runtime.RemoteObject
      name?: string
      startLocation?: Location
      endLocation?: Location
    }
    /** Search match for resource. */
    export type SearchMatch = { lineNumber: number; lineContent: string }

    export type BreakLocation = {
      scriptId: Runtime.ScriptId
      lineNumber: number
      columnNumber?: number
      type?: 'debuggerStatement' | 'call' | 'return'
    }
    export type BreakpointResolvedEvent = { breakpointId: BreakpointId; location: Location }
    export type PausedEvent = {
      callFrames: CallFrame[]
      reason: 'ambiguous' | 'assert' | 'debugCommand' | 'DOM' | 'EventListener' | 'exception' | 'instrumentation' | 'OOM' | 'other' | 'promiseRejection' | 'XHR'
      data?: { [key: string]: any }
      hitBreakpoints?: string[]
      asyncStackTrace?: Runtime.StackTrace
      asyncStackTraceId?: Runtime.StackTraceId
      asyncCallStackTraceId?: Runtime.StackTraceId
    }
    export type ResumedEvent = { [key: string]: any }
    export type ScriptFailedToParseEvent = {
      scriptId: Runtime.ScriptId
      url: string
      startLine: number
      startColumn: number
      endLine: number
      endColumn: number
      executionContextId: Runtime.ExecutionContextId
      hash: string
      executionContextAuxData?: { [key: string]: any }
      sourceMapURL?: string
      hasSourceURL?: boolean
      isModule?: boolean
      length?: number
      stackTrace?: Runtime.StackTrace
    }
    export type ScriptParsedEvent = {
      scriptId: Runtime.ScriptId
      url: string
      startLine: number
      startColumn: number
      endLine: number
      endColumn: number
      executionContextId: Runtime.ExecutionContextId
      hash: string
      executionContextAuxData?: { [key: string]: any }
      isLiveEdit?: boolean
      sourceMapURL?: string
      hasSourceURL?: boolean
      isModule?: boolean
      length?: number
      stackTrace?: Runtime.StackTrace
    }
    export type ContinueToLocationRequest = { location: Location; targetCallFrames?: 'any' | 'current' }
    export type ContinueToLocationResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = { maxScriptsCacheSize?: number }
    export type EnableResponse = { debuggerId: Runtime.UniqueDebuggerId }
    export type EvaluateOnCallFrameRequest = {
      callFrameId: CallFrameId
      expression: string
      objectGroup?: string
      includeCommandLineAPI?: boolean
      silent?: boolean
      returnByValue?: boolean
      generatePreview?: boolean
      throwOnSideEffect?: boolean
      timeout?: Runtime.TimeDelta
    }
    export type EvaluateOnCallFrameResponse = {
      result: Runtime.RemoteObject
      exceptionDetails?: Runtime.ExceptionDetails
    }
    export type GetPossibleBreakpointsRequest = { start: Location; end?: Location; restrictToFunction?: boolean }
    export type GetPossibleBreakpointsResponse = { locations: BreakLocation[] }
    export type GetScriptSourceRequest = { scriptId: Runtime.ScriptId }
    export type GetScriptSourceResponse = { scriptSource: string }
    export type GetStackTraceRequest = { stackTraceId: Runtime.StackTraceId }
    export type GetStackTraceResponse = { stackTrace: Runtime.StackTrace }
    export type PauseRequest = {}
    export type PauseResponse = {}
    export type PauseOnAsyncCallRequest = { parentStackTraceId: Runtime.StackTraceId }
    export type PauseOnAsyncCallResponse = {}
    export type RemoveBreakpointRequest = { breakpointId: BreakpointId }
    export type RemoveBreakpointResponse = {}
    export type RestartFrameRequest = { callFrameId: CallFrameId }
    export type RestartFrameResponse = {
      callFrames: CallFrame[]
      asyncStackTrace?: Runtime.StackTrace
      asyncStackTraceId?: Runtime.StackTraceId
    }
    export type ResumeRequest = {}
    export type ResumeResponse = {}
    export type SearchInContentRequest = {
      scriptId: Runtime.ScriptId
      query: string
      caseSensitive?: boolean
      isRegex?: boolean
    }
    export type SearchInContentResponse = { result: SearchMatch[] }
    export type SetAsyncCallStackDepthRequest = { maxDepth: number }
    export type SetAsyncCallStackDepthResponse = {}
    export type SetBlackboxPatternsRequest = { patterns: string[] }
    export type SetBlackboxPatternsResponse = {}
    export type SetBlackboxedRangesRequest = { scriptId: Runtime.ScriptId; positions: ScriptPosition[] }
    export type SetBlackboxedRangesResponse = {}
    export type SetBreakpointRequest = { location: Location; condition?: string }
    export type SetBreakpointResponse = { breakpointId: BreakpointId; actualLocation: Location }
    export type SetInstrumentationBreakpointRequest = {
      instrumentation: 'beforeScriptExecution' | 'beforeScriptWithSourceMapExecution'
    }
    export type SetInstrumentationBreakpointResponse = { breakpointId: BreakpointId }
    export type SetBreakpointByUrlRequest = {
      lineNumber: number
      url?: string
      urlRegex?: string
      scriptHash?: string
      columnNumber?: number
      condition?: string
    }
    export type SetBreakpointByUrlResponse = { breakpointId: BreakpointId; locations: Location[] }
    export type SetBreakpointOnFunctionCallRequest = { objectId: Runtime.RemoteObjectId; condition?: string }
    export type SetBreakpointOnFunctionCallResponse = { breakpointId: BreakpointId }
    export type SetBreakpointsActiveRequest = { active: boolean }
    export type SetBreakpointsActiveResponse = {}
    export type SetPauseOnExceptionsRequest = { state: 'none' | 'uncaught' | 'all' }
    export type SetPauseOnExceptionsResponse = {}
    export type SetReturnValueRequest = { newValue: Runtime.CallArgument }
    export type SetReturnValueResponse = {}
    export type SetScriptSourceRequest = { scriptId: Runtime.ScriptId; scriptSource: string; dryRun?: boolean }
    export type SetScriptSourceResponse = {
      callFrames?: CallFrame[]
      stackChanged?: boolean
      asyncStackTrace?: Runtime.StackTrace
      asyncStackTraceId?: Runtime.StackTraceId
      exceptionDetails?: Runtime.ExceptionDetails
    }
    export type SetSkipAllPausesRequest = { skip: boolean }
    export type SetSkipAllPausesResponse = {}
    export type SetVariableValueRequest = {
      scopeNumber: number
      variableName: string
      newValue: Runtime.CallArgument
      callFrameId: CallFrameId
    }
    export type SetVariableValueResponse = {}
    export type StepIntoRequest = { breakOnAsyncCall?: boolean }
    export type StepIntoResponse = {}
    export type StepOutRequest = {}
    export type StepOutResponse = {}
    export type StepOverRequest = {}
    export type StepOverResponse = {}
  }
  export namespace HeapProfiler {
    /** Heap snapshot object id. */
    export type HeapSnapshotObjectId = string
    /** Sampling Heap Profile node. Holds callsite information, allocation statistics and child nodes. */
    export type SamplingHeapProfileNode = {
      callFrame: Runtime.CallFrame
      selfSize: number
      id: number
      children: SamplingHeapProfileNode[]
    }
    /** A single sample from a sampling profile. */
    export type SamplingHeapProfileSample = { size: number; nodeId: number; ordinal: number }
    /** Sampling profile. */
    export type SamplingHeapProfile = { head: SamplingHeapProfileNode; samples: SamplingHeapProfileSample[] }
    export type AddHeapSnapshotChunkEvent = { chunk: string }
    export type HeapStatsUpdateEvent = { statsUpdate: number[] }
    export type LastSeenObjectIdEvent = { lastSeenObjectId: number; timestamp: number }
    export type ReportHeapSnapshotProgressEvent = { done: number; total: number; finished?: boolean }
    export type ResetProfilesEvent = { [key: string]: any }
    export type AddInspectedHeapObjectRequest = { heapObjectId: HeapSnapshotObjectId }
    export type AddInspectedHeapObjectResponse = {}
    export type CollectGarbageRequest = {}
    export type CollectGarbageResponse = {}
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetHeapObjectIdRequest = { objectId: Runtime.RemoteObjectId }
    export type GetHeapObjectIdResponse = { heapSnapshotObjectId: HeapSnapshotObjectId }
    export type GetObjectByHeapObjectIdRequest = { objectId: HeapSnapshotObjectId; objectGroup?: string }
    export type GetObjectByHeapObjectIdResponse = { result: Runtime.RemoteObject }
    export type GetSamplingProfileRequest = {}
    export type GetSamplingProfileResponse = { profile: SamplingHeapProfile }
    export type StartSamplingRequest = { samplingInterval?: number }
    export type StartSamplingResponse = {}
    export type StartTrackingHeapObjectsRequest = { trackAllocations?: boolean }
    export type StartTrackingHeapObjectsResponse = {}
    export type StopSamplingRequest = {}
    export type StopSamplingResponse = { profile: SamplingHeapProfile }
    export type StopTrackingHeapObjectsRequest = { reportProgress?: boolean }
    export type StopTrackingHeapObjectsResponse = {}
    export type TakeHeapSnapshotRequest = { reportProgress?: boolean }
    export type TakeHeapSnapshotResponse = {}
  }
  export namespace Profiler {
    /** Profile node. Holds callsite information, execution statistics and child nodes. */
    export type ProfileNode = {
      id: number
      callFrame: Runtime.CallFrame
      hitCount?: number
      children?: number[]
      deoptReason?: string
      positionTicks?: PositionTickInfo[]
    }
    /** Profile. */
    export type Profile = {
      nodes: ProfileNode[]
      startTime: number
      endTime: number
      samples?: number[]
      timeDeltas?: number[]
    }
    /** Specifies a number of samples attributed to a certain source position. */
    export type PositionTickInfo = { line: number; ticks: number }
    /** Coverage data for a source range. */
    export type CoverageRange = { startOffset: number; endOffset: number; count: number }
    /** Coverage data for a JavaScript function. */
    export type FunctionCoverage = { functionName: string; ranges: CoverageRange[]; isBlockCoverage: boolean }
    /** Coverage data for a JavaScript script. */
    export type ScriptCoverage = { scriptId: Runtime.ScriptId; url: string; functions: FunctionCoverage[] }
    /** Describes a type collected during runtime. */
    export type TypeObject = { name: string }
    /** Source offset and types for a parameter or return value. */
    export type TypeProfileEntry = { offset: number; types: TypeObject[] }
    /** Type profile data collected during runtime for a JavaScript script. */
    export type ScriptTypeProfile = { scriptId: Runtime.ScriptId; url: string; entries: TypeProfileEntry[] }
    export type ConsoleProfileFinishedEvent = {
      id: string
      location: Debugger.Location
      profile: Profile
      title?: string
    }
    export type ConsoleProfileStartedEvent = { id: string; location: Debugger.Location; title?: string }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type GetBestEffortCoverageRequest = {}
    export type GetBestEffortCoverageResponse = { result: ScriptCoverage[] }
    export type SetSamplingIntervalRequest = { interval: number }
    export type SetSamplingIntervalResponse = {}
    export type StartRequest = {}
    export type StartResponse = {}
    export type StartPreciseCoverageRequest = { callCount?: boolean; detailed?: boolean }
    export type StartPreciseCoverageResponse = {}
    export type StartTypeProfileRequest = {}
    export type StartTypeProfileResponse = {}
    export type StopRequest = {}
    export type StopResponse = { profile: Profile }
    export type StopPreciseCoverageRequest = {}
    export type StopPreciseCoverageResponse = {}
    export type StopTypeProfileRequest = {}
    export type StopTypeProfileResponse = {}
    export type TakePreciseCoverageRequest = {}
    export type TakePreciseCoverageResponse = { result: ScriptCoverage[] }
    export type TakeTypeProfileRequest = {}
    export type TakeTypeProfileResponse = { result: ScriptTypeProfile[] }
  }
  export namespace Runtime {
    /** Unique script identifier. */
    export type ScriptId = string
    /** Unique object identifier. */
    export type RemoteObjectId = string
    /** Primitive value which cannot be JSON-stringified. Includes values `-0`, `NaN`, `Infinity`, `-Infinity`, and bigint literals. */
    export type UnserializableValue = string
    /** Mirror object referencing original JavaScript object. */
    export type RemoteObject = {
      type: 'object' | 'function' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint'
      subtype?:
        | 'array'
        | 'null'
        | 'node'
        | 'regexp'
        | 'date'
        | 'map'
        | 'set'
        | 'weakmap'
        | 'weakset'
        | 'iterator'
        | 'generator'
        | 'error'
        | 'proxy'
        | 'promise'
        | 'typedarray'
        | 'arraybuffer'
        | 'dataview'
      className?: string
      value?: any
      unserializableValue?: UnserializableValue
      description?: string
      objectId?: RemoteObjectId
      preview?: ObjectPreview
      customPreview?: CustomPreview
    }

    export type CustomPreview = { header: string; bodyGetterId?: RemoteObjectId }
    /** Object containing abbreviated remote object value. */
    export type ObjectPreview = {
      type: 'object' | 'function' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint'
      subtype?: 'array' | 'null' | 'node' | 'regexp' | 'date' | 'map' | 'set' | 'weakmap' | 'weakset' | 'iterator' | 'generator' | 'error'
      description?: string
      overflow: boolean
      properties: PropertyPreview[]
      entries?: EntryPreview[]
    }

    export type PropertyPreview = {
      name: string
      type: 'object' | 'function' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'accessor' | 'bigint'
      value?: string
      valuePreview?: ObjectPreview
      subtype?: 'array' | 'null' | 'node' | 'regexp' | 'date' | 'map' | 'set' | 'weakmap' | 'weakset' | 'iterator' | 'generator' | 'error'
    }

    export type EntryPreview = { key?: ObjectPreview; value: ObjectPreview }
    /** Object property descriptor. */
    export type PropertyDescriptor = {
      name: string
      value?: RemoteObject
      writable?: boolean
      get?: RemoteObject
      set?: RemoteObject
      configurable: boolean
      enumerable: boolean
      wasThrown?: boolean
      isOwn?: boolean
      symbol?: RemoteObject
    }
    /** Object internal property descriptor. This property isn't normally visible in JavaScript code. */
    export type InternalPropertyDescriptor = { name: string; value?: RemoteObject }
    /** Object private field descriptor. */
    export type PrivatePropertyDescriptor = { name: string; value: RemoteObject }
    /** Represents function call argument. Either remote object id `objectId`, primitive `value`, unserializable primitive value or neither of (for undefined) them should be specified. */
    export type CallArgument = { value?: any; unserializableValue?: UnserializableValue; objectId?: RemoteObjectId }
    /** Id of an execution context. */
    export type ExecutionContextId = number
    /** Description of an isolated world. */
    export type ExecutionContextDescription = {
      id: ExecutionContextId
      origin: string
      name: string
      auxData?: { [key: string]: any }
    }
    /** Detailed information about exception (or error) that was thrown during script compilation or execution. */
    export type ExceptionDetails = {
      exceptionId: number
      text: string
      lineNumber: number
      columnNumber: number
      scriptId?: ScriptId
      url?: string
      stackTrace?: StackTrace
      exception?: RemoteObject
      executionContextId?: ExecutionContextId
    }
    /** Number of milliseconds since epoch. */
    export type Timestamp = number
    /** Number of milliseconds. */
    export type TimeDelta = number
    /** Stack entry for runtime errors and assertions. */
    export type CallFrame = {
      functionName: string
      scriptId: ScriptId
      url: string
      lineNumber: number
      columnNumber: number
    }
    /** Call frames for assertions or error messages. */
    export type StackTrace = {
      description?: string
      callFrames: CallFrame[]
      parent?: StackTrace
      parentId?: StackTraceId
    }
    /** Unique identifier of current debugger. */
    export type UniqueDebuggerId = string
    /** If `debuggerId` is set stack trace comes from another debugger and can be resolved there. This allows to track cross-debugger calls. See `Runtime.StackTrace` and `Debugger.paused` for usages. */
    export type StackTraceId = { id: string; debuggerId?: UniqueDebuggerId }
    export type BindingCalledEvent = { name: string; payload: string; executionContextId: ExecutionContextId }
    export type ConsoleAPICalledEvent = {
      type:
        | 'log'
        | 'debug'
        | 'info'
        | 'error'
        | 'warning'
        | 'dir'
        | 'dirxml'
        | 'table'
        | 'trace'
        | 'clear'
        | 'startGroup'
        | 'startGroupCollapsed'
        | 'endGroup'
        | 'assert'
        | 'profile'
        | 'profileEnd'
        | 'count'
        | 'timeEnd'
      args: RemoteObject[]
      executionContextId: ExecutionContextId
      timestamp: Timestamp
      stackTrace?: StackTrace
      context?: string
    }
    export type ExceptionRevokedEvent = { reason: string; exceptionId: number }
    export type ExceptionThrownEvent = { timestamp: Timestamp; exceptionDetails: ExceptionDetails }
    export type ExecutionContextCreatedEvent = { context: ExecutionContextDescription }
    export type ExecutionContextDestroyedEvent = { executionContextId: ExecutionContextId }
    export type ExecutionContextsClearedEvent = { [key: string]: any }
    export type InspectRequestedEvent = { object: RemoteObject; hints: { [key: string]: any } }
    export type AwaitPromiseRequest = {
      promiseObjectId: RemoteObjectId
      returnByValue?: boolean
      generatePreview?: boolean
    }
    export type AwaitPromiseResponse = { result: RemoteObject; exceptionDetails?: ExceptionDetails }
    export type CallFunctionOnRequest = {
      functionDeclaration: string
      objectId?: RemoteObjectId
      arguments?: CallArgument[]
      silent?: boolean
      returnByValue?: boolean
      generatePreview?: boolean
      userGesture?: boolean
      awaitPromise?: boolean
      executionContextId?: ExecutionContextId
      objectGroup?: string
    }
    export type CallFunctionOnResponse = { result: RemoteObject; exceptionDetails?: ExceptionDetails }
    export type CompileScriptRequest = {
      expression: string
      sourceURL: string
      persistScript: boolean
      executionContextId?: ExecutionContextId
    }
    export type CompileScriptResponse = { scriptId?: ScriptId; exceptionDetails?: ExceptionDetails }
    export type DisableRequest = {}
    export type DisableResponse = {}
    export type DiscardConsoleEntriesRequest = {}
    export type DiscardConsoleEntriesResponse = {}
    export type EnableRequest = {}
    export type EnableResponse = {}
    export type EvaluateRequest = {
      expression: string
      objectGroup?: string
      includeCommandLineAPI?: boolean
      silent?: boolean
      contextId?: ExecutionContextId
      returnByValue?: boolean
      generatePreview?: boolean
      userGesture?: boolean
      awaitPromise?: boolean
      throwOnSideEffect?: boolean
      timeout?: TimeDelta
    }
    export type EvaluateResponse = { result: RemoteObject; exceptionDetails?: ExceptionDetails }
    export type GetIsolateIdRequest = {}
    export type GetIsolateIdResponse = { id: string }
    export type GetHeapUsageRequest = {}
    export type GetHeapUsageResponse = { usedSize: number; totalSize: number }
    export type GetPropertiesRequest = {
      objectId: RemoteObjectId
      ownProperties?: boolean
      accessorPropertiesOnly?: boolean
      generatePreview?: boolean
    }
    export type GetPropertiesResponse = {
      result: PropertyDescriptor[]
      internalProperties?: InternalPropertyDescriptor[]
      privateProperties?: PrivatePropertyDescriptor[]
      exceptionDetails?: ExceptionDetails
    }
    export type GlobalLexicalScopeNamesRequest = { executionContextId?: ExecutionContextId }
    export type GlobalLexicalScopeNamesResponse = { names: string[] }
    export type QueryObjectsRequest = { prototypeObjectId: RemoteObjectId; objectGroup?: string }
    export type QueryObjectsResponse = { objects: RemoteObject }
    export type ReleaseObjectRequest = { objectId: RemoteObjectId }
    export type ReleaseObjectResponse = {}
    export type ReleaseObjectGroupRequest = { objectGroup: string }
    export type ReleaseObjectGroupResponse = {}
    export type RunIfWaitingForDebuggerRequest = {}
    export type RunIfWaitingForDebuggerResponse = {}
    export type RunScriptRequest = {
      scriptId: ScriptId
      executionContextId?: ExecutionContextId
      objectGroup?: string
      silent?: boolean
      includeCommandLineAPI?: boolean
      returnByValue?: boolean
      generatePreview?: boolean
      awaitPromise?: boolean
    }
    export type RunScriptResponse = { result: RemoteObject; exceptionDetails?: ExceptionDetails }
    export type SetAsyncCallStackDepthRequest = { maxDepth: number }
    export type SetAsyncCallStackDepthResponse = {}
    export type SetCustomObjectFormatterEnabledRequest = { enabled: boolean }
    export type SetCustomObjectFormatterEnabledResponse = {}
    export type SetMaxCallStackSizeToCaptureRequest = { size: number }
    export type SetMaxCallStackSizeToCaptureResponse = {}
    export type TerminateExecutionRequest = {}
    export type TerminateExecutionResponse = {}
    export type AddBindingRequest = { name: string; executionContextId?: ExecutionContextId }
    export type AddBindingResponse = {}
    export type RemoveBindingRequest = { name: string }
    export type RemoveBindingResponse = {}
  }
  export namespace Schema {
    /** Description of the protocol domain. */
    export type Domain = { name: string; version: string }
    export type GetDomainsRequest = {}
    export type GetDomainsResponse = { domains: Domain[] }
  }
  export class Accessibility {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Disables the accessibility domain. */
    public disable(request: Accessibility.DisableRequest): Promise<Accessibility.DisableResponse> {
      return this.adapter.call('Accessibility.disable', request)
    }
    /** Enables the accessibility domain which causes `AXNodeId`s to remain consistent between method calls. This turns on accessibility for the page, which can impact performance until accessibility is disabled. */
    public enable(request: Accessibility.EnableRequest): Promise<Accessibility.EnableResponse> {
      return this.adapter.call('Accessibility.enable', request)
    }
    /** Fetches the accessibility node and partial accessibility tree for this DOM node, if it exists. */
    public getPartialAXTree(request: Accessibility.GetPartialAXTreeRequest): Promise<Accessibility.GetPartialAXTreeResponse> {
      return this.adapter.call('Accessibility.getPartialAXTree', request)
    }
    /** Fetches the entire accessibility tree */
    public getFullAXTree(request: Accessibility.GetFullAXTreeRequest): Promise<Accessibility.GetFullAXTreeResponse> {
      return this.adapter.call('Accessibility.getFullAXTree', request)
    }
  }
  export class Animation {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Animation.animationCanceled', (event) => this.events.send('animationCanceled', event))
      this.adapter.on('Animation.animationCreated', (event) => this.events.send('animationCreated', event))
      this.adapter.on('Animation.animationStarted', (event) => this.events.send('animationStarted', event))
    }
    /** Disables animation domain notifications. */
    public disable(request: Animation.DisableRequest): Promise<Animation.DisableResponse> {
      return this.adapter.call('Animation.disable', request)
    }
    /** Enables animation domain notifications. */
    public enable(request: Animation.EnableRequest): Promise<Animation.EnableResponse> {
      return this.adapter.call('Animation.enable', request)
    }
    /** Returns the current time of the an animation. */
    public getCurrentTime(request: Animation.GetCurrentTimeRequest): Promise<Animation.GetCurrentTimeResponse> {
      return this.adapter.call('Animation.getCurrentTime', request)
    }
    /** Gets the playback rate of the document timeline. */
    public getPlaybackRate(request: Animation.GetPlaybackRateRequest): Promise<Animation.GetPlaybackRateResponse> {
      return this.adapter.call('Animation.getPlaybackRate', request)
    }
    /** Releases a set of animations to no longer be manipulated. */
    public releaseAnimations(request: Animation.ReleaseAnimationsRequest): Promise<Animation.ReleaseAnimationsResponse> {
      return this.adapter.call('Animation.releaseAnimations', request)
    }
    /** Gets the remote object of the Animation. */
    public resolveAnimation(request: Animation.ResolveAnimationRequest): Promise<Animation.ResolveAnimationResponse> {
      return this.adapter.call('Animation.resolveAnimation', request)
    }
    /** Seek a set of animations to a particular time within each animation. */
    public seekAnimations(request: Animation.SeekAnimationsRequest): Promise<Animation.SeekAnimationsResponse> {
      return this.adapter.call('Animation.seekAnimations', request)
    }
    /** Sets the paused state of a set of animations. */
    public setPaused(request: Animation.SetPausedRequest): Promise<Animation.SetPausedResponse> {
      return this.adapter.call('Animation.setPaused', request)
    }
    /** Sets the playback rate of the document timeline. */
    public setPlaybackRate(request: Animation.SetPlaybackRateRequest): Promise<Animation.SetPlaybackRateResponse> {
      return this.adapter.call('Animation.setPlaybackRate', request)
    }
    /** Sets the timing of an animation node. */
    public setTiming(request: Animation.SetTimingRequest): Promise<Animation.SetTimingResponse> {
      return this.adapter.call('Animation.setTiming', request)
    }
    /** Event for when an animation has been cancelled. */
    public on(event: 'animationCanceled', handler: EventHandler<Animation.AnimationCanceledEvent>): EventListener
    /** Event for each animation that has been created. */
    public on(event: 'animationCreated', handler: EventHandler<Animation.AnimationCreatedEvent>): EventListener
    /** Event for animation that has been started. */
    public on(event: 'animationStarted', handler: EventHandler<Animation.AnimationStartedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Event for when an animation has been cancelled. */
    public once(event: 'animationCanceled', handler: EventHandler<Animation.AnimationCanceledEvent>): EventListener
    /** Event for each animation that has been created. */
    public once(event: 'animationCreated', handler: EventHandler<Animation.AnimationCreatedEvent>): EventListener
    /** Event for animation that has been started. */
    public once(event: 'animationStarted', handler: EventHandler<Animation.AnimationStartedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class ApplicationCache {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('ApplicationCache.applicationCacheStatusUpdated', (event) => this.events.send('applicationCacheStatusUpdated', event))
      this.adapter.on('ApplicationCache.networkStateUpdated', (event) => this.events.send('networkStateUpdated', event))
    }
    /** Enables application cache domain notifications. */
    public enable(request: ApplicationCache.EnableRequest): Promise<ApplicationCache.EnableResponse> {
      return this.adapter.call('ApplicationCache.enable', request)
    }
    /** Returns relevant application cache data for the document in given frame. */
    public getApplicationCacheForFrame(request: ApplicationCache.GetApplicationCacheForFrameRequest): Promise<ApplicationCache.GetApplicationCacheForFrameResponse> {
      return this.adapter.call('ApplicationCache.getApplicationCacheForFrame', request)
    }
    /** Returns array of frame identifiers with manifest urls for each frame containing a document associated with some application cache. */
    public getFramesWithManifests(request: ApplicationCache.GetFramesWithManifestsRequest): Promise<ApplicationCache.GetFramesWithManifestsResponse> {
      return this.adapter.call('ApplicationCache.getFramesWithManifests', request)
    }
    /** Returns manifest URL for document in the given frame. */
    public getManifestForFrame(request: ApplicationCache.GetManifestForFrameRequest): Promise<ApplicationCache.GetManifestForFrameResponse> {
      return this.adapter.call('ApplicationCache.getManifestForFrame', request)
    }

    public on(event: 'applicationCacheStatusUpdated', handler: EventHandler<ApplicationCache.ApplicationCacheStatusUpdatedEvent>): EventListener

    public on(event: 'networkStateUpdated', handler: EventHandler<ApplicationCache.NetworkStateUpdatedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'applicationCacheStatusUpdated', handler: EventHandler<ApplicationCache.ApplicationCacheStatusUpdatedEvent>): EventListener

    public once(event: 'networkStateUpdated', handler: EventHandler<ApplicationCache.NetworkStateUpdatedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Audits {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Returns the response body and size if it were re-encoded with the specified settings. Only applies to images. */
    public getEncodedResponse(request: Audits.GetEncodedResponseRequest): Promise<Audits.GetEncodedResponseResponse> {
      return this.adapter.call('Audits.getEncodedResponse', request)
    }
  }
  export class BackgroundService {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('BackgroundService.recordingStateChanged', (event) => this.events.send('recordingStateChanged', event))
      this.adapter.on('BackgroundService.backgroundServiceEventReceived', (event) => this.events.send('backgroundServiceEventReceived', event))
    }
    /** Enables event updates for the service. */
    public startObserving(request: BackgroundService.StartObservingRequest): Promise<BackgroundService.StartObservingResponse> {
      return this.adapter.call('BackgroundService.startObserving', request)
    }
    /** Disables event updates for the service. */
    public stopObserving(request: BackgroundService.StopObservingRequest): Promise<BackgroundService.StopObservingResponse> {
      return this.adapter.call('BackgroundService.stopObserving', request)
    }
    /** Set the recording state for the service. */
    public setRecording(request: BackgroundService.SetRecordingRequest): Promise<BackgroundService.SetRecordingResponse> {
      return this.adapter.call('BackgroundService.setRecording', request)
    }
    /** Clears all stored data for the service. */
    public clearEvents(request: BackgroundService.ClearEventsRequest): Promise<BackgroundService.ClearEventsResponse> {
      return this.adapter.call('BackgroundService.clearEvents', request)
    }
    /** Called when the recording state for the service has been updated. */
    public on(event: 'recordingStateChanged', handler: EventHandler<BackgroundService.RecordingStateChangedEvent>): EventListener
    /** Called with all existing backgroundServiceEvents when enabled, and all new events afterwards if enabled and recording. */
    public on(event: 'backgroundServiceEventReceived', handler: EventHandler<BackgroundService.BackgroundServiceEventReceivedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Called when the recording state for the service has been updated. */
    public once(event: 'recordingStateChanged', handler: EventHandler<BackgroundService.RecordingStateChangedEvent>): EventListener
    /** Called with all existing backgroundServiceEvents when enabled, and all new events afterwards if enabled and recording. */
    public once(event: 'backgroundServiceEventReceived', handler: EventHandler<BackgroundService.BackgroundServiceEventReceivedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Browser {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Grant specific permissions to the given origin and reject all others. */
    public grantPermissions(request: Browser.GrantPermissionsRequest): Promise<Browser.GrantPermissionsResponse> {
      return this.adapter.call('Browser.grantPermissions', request)
    }
    /** Reset all permission management for all origins. */
    public resetPermissions(request: Browser.ResetPermissionsRequest): Promise<Browser.ResetPermissionsResponse> {
      return this.adapter.call('Browser.resetPermissions', request)
    }
    /** Close browser gracefully. */
    public close(request: Browser.CloseRequest): Promise<Browser.CloseResponse> {
      return this.adapter.call('Browser.close', request)
    }
    /** Crashes browser on the main thread. */
    public crash(request: Browser.CrashRequest): Promise<Browser.CrashResponse> {
      return this.adapter.call('Browser.crash', request)
    }
    /** Crashes GPU process. */
    public crashGpuProcess(request: Browser.CrashGpuProcessRequest): Promise<Browser.CrashGpuProcessResponse> {
      return this.adapter.call('Browser.crashGpuProcess', request)
    }
    /** Returns version information. */
    public getVersion(request: Browser.GetVersionRequest): Promise<Browser.GetVersionResponse> {
      return this.adapter.call('Browser.getVersion', request)
    }
    /** Returns the command line switches for the browser process if, and only if --enable-automation is on the commandline. */
    public getBrowserCommandLine(request: Browser.GetBrowserCommandLineRequest): Promise<Browser.GetBrowserCommandLineResponse> {
      return this.adapter.call('Browser.getBrowserCommandLine', request)
    }
    /** Get Chrome histograms. */
    public getHistograms(request: Browser.GetHistogramsRequest): Promise<Browser.GetHistogramsResponse> {
      return this.adapter.call('Browser.getHistograms', request)
    }
    /** Get a Chrome histogram by name. */
    public getHistogram(request: Browser.GetHistogramRequest): Promise<Browser.GetHistogramResponse> {
      return this.adapter.call('Browser.getHistogram', request)
    }
    /** Get position and size of the browser window. */
    public getWindowBounds(request: Browser.GetWindowBoundsRequest): Promise<Browser.GetWindowBoundsResponse> {
      return this.adapter.call('Browser.getWindowBounds', request)
    }
    /** Get the browser window that contains the devtools target. */
    public getWindowForTarget(request: Browser.GetWindowForTargetRequest): Promise<Browser.GetWindowForTargetResponse> {
      return this.adapter.call('Browser.getWindowForTarget', request)
    }
    /** Set position and/or size of the browser window. */
    public setWindowBounds(request: Browser.SetWindowBoundsRequest): Promise<Browser.SetWindowBoundsResponse> {
      return this.adapter.call('Browser.setWindowBounds', request)
    }
    /** Set dock tile details, platform-specific. */
    public setDockTile(request: Browser.SetDockTileRequest): Promise<Browser.SetDockTileResponse> {
      return this.adapter.call('Browser.setDockTile', request)
    }
  }
  export class CSS {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('CSS.fontsUpdated', (event) => this.events.send('fontsUpdated', event))
      this.adapter.on('CSS.mediaQueryResultChanged', (event) => this.events.send('mediaQueryResultChanged', event))
      this.adapter.on('CSS.styleSheetAdded', (event) => this.events.send('styleSheetAdded', event))
      this.adapter.on('CSS.styleSheetChanged', (event) => this.events.send('styleSheetChanged', event))
      this.adapter.on('CSS.styleSheetRemoved', (event) => this.events.send('styleSheetRemoved', event))
    }
    /** Inserts a new rule with the given `ruleText` in a stylesheet with given `styleSheetId`, at the position specified by `location`. */
    public addRule(request: CSS.AddRuleRequest): Promise<CSS.AddRuleResponse> {
      return this.adapter.call('CSS.addRule', request)
    }
    /** Returns all class names from specified stylesheet. */
    public collectClassNames(request: CSS.CollectClassNamesRequest): Promise<CSS.CollectClassNamesResponse> {
      return this.adapter.call('CSS.collectClassNames', request)
    }
    /** Creates a new special "via-inspector" stylesheet in the frame with given `frameId`. */
    public createStyleSheet(request: CSS.CreateStyleSheetRequest): Promise<CSS.CreateStyleSheetResponse> {
      return this.adapter.call('CSS.createStyleSheet', request)
    }
    /** Disables the CSS agent for the given page. */
    public disable(request: CSS.DisableRequest): Promise<CSS.DisableResponse> {
      return this.adapter.call('CSS.disable', request)
    }
    /** Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been enabled until the result of this command is received. */
    public enable(request: CSS.EnableRequest): Promise<CSS.EnableResponse> {
      return this.adapter.call('CSS.enable', request)
    }
    /** Ensures that the given node will have specified pseudo-classes whenever its style is computed by the browser. */
    public forcePseudoState(request: CSS.ForcePseudoStateRequest): Promise<CSS.ForcePseudoStateResponse> {
      return this.adapter.call('CSS.forcePseudoState', request)
    }

    public getBackgroundColors(request: CSS.GetBackgroundColorsRequest): Promise<CSS.GetBackgroundColorsResponse> {
      return this.adapter.call('CSS.getBackgroundColors', request)
    }
    /** Returns the computed style for a DOM node identified by `nodeId`. */
    public getComputedStyleForNode(request: CSS.GetComputedStyleForNodeRequest): Promise<CSS.GetComputedStyleForNodeResponse> {
      return this.adapter.call('CSS.getComputedStyleForNode', request)
    }
    /** Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM attributes) for a DOM node identified by `nodeId`. */
    public getInlineStylesForNode(request: CSS.GetInlineStylesForNodeRequest): Promise<CSS.GetInlineStylesForNodeResponse> {
      return this.adapter.call('CSS.getInlineStylesForNode', request)
    }
    /** Returns requested styles for a DOM node identified by `nodeId`. */
    public getMatchedStylesForNode(request: CSS.GetMatchedStylesForNodeRequest): Promise<CSS.GetMatchedStylesForNodeResponse> {
      return this.adapter.call('CSS.getMatchedStylesForNode', request)
    }
    /** Returns all media queries parsed by the rendering engine. */
    public getMediaQueries(request: CSS.GetMediaQueriesRequest): Promise<CSS.GetMediaQueriesResponse> {
      return this.adapter.call('CSS.getMediaQueries', request)
    }
    /** Requests information about platform fonts which we used to render child TextNodes in the given node. */
    public getPlatformFontsForNode(request: CSS.GetPlatformFontsForNodeRequest): Promise<CSS.GetPlatformFontsForNodeResponse> {
      return this.adapter.call('CSS.getPlatformFontsForNode', request)
    }
    /** Returns the current textual content for a stylesheet. */
    public getStyleSheetText(request: CSS.GetStyleSheetTextRequest): Promise<CSS.GetStyleSheetTextResponse> {
      return this.adapter.call('CSS.getStyleSheetText', request)
    }
    /** Find a rule with the given active property for the given node and set the new value for this property */
    public setEffectivePropertyValueForNode(request: CSS.SetEffectivePropertyValueForNodeRequest): Promise<CSS.SetEffectivePropertyValueForNodeResponse> {
      return this.adapter.call('CSS.setEffectivePropertyValueForNode', request)
    }
    /** Modifies the keyframe rule key text. */
    public setKeyframeKey(request: CSS.SetKeyframeKeyRequest): Promise<CSS.SetKeyframeKeyResponse> {
      return this.adapter.call('CSS.setKeyframeKey', request)
    }
    /** Modifies the rule selector. */
    public setMediaText(request: CSS.SetMediaTextRequest): Promise<CSS.SetMediaTextResponse> {
      return this.adapter.call('CSS.setMediaText', request)
    }
    /** Modifies the rule selector. */
    public setRuleSelector(request: CSS.SetRuleSelectorRequest): Promise<CSS.SetRuleSelectorResponse> {
      return this.adapter.call('CSS.setRuleSelector', request)
    }
    /** Sets the new stylesheet text. */
    public setStyleSheetText(request: CSS.SetStyleSheetTextRequest): Promise<CSS.SetStyleSheetTextResponse> {
      return this.adapter.call('CSS.setStyleSheetText', request)
    }
    /** Applies specified style edits one after another in the given order. */
    public setStyleTexts(request: CSS.SetStyleTextsRequest): Promise<CSS.SetStyleTextsResponse> {
      return this.adapter.call('CSS.setStyleTexts', request)
    }
    /** Enables the selector recording. */
    public startRuleUsageTracking(request: CSS.StartRuleUsageTrackingRequest): Promise<CSS.StartRuleUsageTrackingResponse> {
      return this.adapter.call('CSS.startRuleUsageTracking', request)
    }
    /** Stop tracking rule usage and return the list of rules that were used since last call to `takeCoverageDelta` (or since start of coverage instrumentation) */
    public stopRuleUsageTracking(request: CSS.StopRuleUsageTrackingRequest): Promise<CSS.StopRuleUsageTrackingResponse> {
      return this.adapter.call('CSS.stopRuleUsageTracking', request)
    }
    /** Obtain list of rules that became used since last call to this method (or since start of coverage instrumentation) */
    public takeCoverageDelta(request: CSS.TakeCoverageDeltaRequest): Promise<CSS.TakeCoverageDeltaResponse> {
      return this.adapter.call('CSS.takeCoverageDelta', request)
    }
    /** Fires whenever a web font is updated.  A non-empty font parameter indicates a successfully loaded web font */
    public on(event: 'fontsUpdated', handler: EventHandler<CSS.FontsUpdatedEvent>): EventListener
    /** Fires whenever a MediaQuery result changes (for example, after a browser window has been resized.) The current implementation considers only viewport-dependent media features. */
    public on(event: 'mediaQueryResultChanged', handler: EventHandler<CSS.MediaQueryResultChangedEvent>): EventListener
    /** Fired whenever an active document stylesheet is added. */
    public on(event: 'styleSheetAdded', handler: EventHandler<CSS.StyleSheetAddedEvent>): EventListener
    /** Fired whenever a stylesheet is changed as a result of the client operation. */
    public on(event: 'styleSheetChanged', handler: EventHandler<CSS.StyleSheetChangedEvent>): EventListener
    /** Fired whenever an active document stylesheet is removed. */
    public on(event: 'styleSheetRemoved', handler: EventHandler<CSS.StyleSheetRemovedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Fires whenever a web font is updated.  A non-empty font parameter indicates a successfully loaded web font */
    public once(event: 'fontsUpdated', handler: EventHandler<CSS.FontsUpdatedEvent>): EventListener
    /** Fires whenever a MediaQuery result changes (for example, after a browser window has been resized.) The current implementation considers only viewport-dependent media features. */
    public once(event: 'mediaQueryResultChanged', handler: EventHandler<CSS.MediaQueryResultChangedEvent>): EventListener
    /** Fired whenever an active document stylesheet is added. */
    public once(event: 'styleSheetAdded', handler: EventHandler<CSS.StyleSheetAddedEvent>): EventListener
    /** Fired whenever a stylesheet is changed as a result of the client operation. */
    public once(event: 'styleSheetChanged', handler: EventHandler<CSS.StyleSheetChangedEvent>): EventListener
    /** Fired whenever an active document stylesheet is removed. */
    public once(event: 'styleSheetRemoved', handler: EventHandler<CSS.StyleSheetRemovedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class CacheStorage {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Deletes a cache. */
    public deleteCache(request: CacheStorage.DeleteCacheRequest): Promise<CacheStorage.DeleteCacheResponse> {
      return this.adapter.call('CacheStorage.deleteCache', request)
    }
    /** Deletes a cache entry. */
    public deleteEntry(request: CacheStorage.DeleteEntryRequest): Promise<CacheStorage.DeleteEntryResponse> {
      return this.adapter.call('CacheStorage.deleteEntry', request)
    }
    /** Requests cache names. */
    public requestCacheNames(request: CacheStorage.RequestCacheNamesRequest): Promise<CacheStorage.RequestCacheNamesResponse> {
      return this.adapter.call('CacheStorage.requestCacheNames', request)
    }
    /** Fetches cache entry. */
    public requestCachedResponse(request: CacheStorage.RequestCachedResponseRequest): Promise<CacheStorage.RequestCachedResponseResponse> {
      return this.adapter.call('CacheStorage.requestCachedResponse', request)
    }
    /** Requests data from cache. */
    public requestEntries(request: CacheStorage.RequestEntriesRequest): Promise<CacheStorage.RequestEntriesResponse> {
      return this.adapter.call('CacheStorage.requestEntries', request)
    }
  }
  export class Cast {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Cast.sinksUpdated', (event) => this.events.send('sinksUpdated', event))
      this.adapter.on('Cast.issueUpdated', (event) => this.events.send('issueUpdated', event))
    }
    /** Starts observing for sinks that can be used for tab mirroring, and if set, sinks compatible with |presentationUrl| as well. When sinks are found, a |sinksUpdated| event is fired. Also starts observing for issue messages. When an issue is added or removed, an |issueUpdated| event is fired. */
    public enable(request: Cast.EnableRequest): Promise<Cast.EnableResponse> {
      return this.adapter.call('Cast.enable', request)
    }
    /** Stops observing for sinks and issues. */
    public disable(request: Cast.DisableRequest): Promise<Cast.DisableResponse> {
      return this.adapter.call('Cast.disable', request)
    }
    /** Sets a sink to be used when the web page requests the browser to choose a sink via Presentation API, Remote Playback API, or Cast SDK. */
    public setSinkToUse(request: Cast.SetSinkToUseRequest): Promise<Cast.SetSinkToUseResponse> {
      return this.adapter.call('Cast.setSinkToUse', request)
    }
    /** Starts mirroring the tab to the sink. */
    public startTabMirroring(request: Cast.StartTabMirroringRequest): Promise<Cast.StartTabMirroringResponse> {
      return this.adapter.call('Cast.startTabMirroring', request)
    }
    /** Stops the active Cast session on the sink. */
    public stopCasting(request: Cast.StopCastingRequest): Promise<Cast.StopCastingResponse> {
      return this.adapter.call('Cast.stopCasting', request)
    }
    /** This is fired whenever the list of available sinks changes. A sink is a device or a software surface that you can cast to. */
    public on(event: 'sinksUpdated', handler: EventHandler<Cast.SinksUpdatedEvent>): EventListener
    /** This is fired whenever the outstanding issue/error message changes. |issueMessage| is empty if there is no issue. */
    public on(event: 'issueUpdated', handler: EventHandler<Cast.IssueUpdatedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** This is fired whenever the list of available sinks changes. A sink is a device or a software surface that you can cast to. */
    public once(event: 'sinksUpdated', handler: EventHandler<Cast.SinksUpdatedEvent>): EventListener
    /** This is fired whenever the outstanding issue/error message changes. |issueMessage| is empty if there is no issue. */
    public once(event: 'issueUpdated', handler: EventHandler<Cast.IssueUpdatedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class DOM {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('DOM.attributeModified', (event) => this.events.send('attributeModified', event))
      this.adapter.on('DOM.attributeRemoved', (event) => this.events.send('attributeRemoved', event))
      this.adapter.on('DOM.characterDataModified', (event) => this.events.send('characterDataModified', event))
      this.adapter.on('DOM.childNodeCountUpdated', (event) => this.events.send('childNodeCountUpdated', event))
      this.adapter.on('DOM.childNodeInserted', (event) => this.events.send('childNodeInserted', event))
      this.adapter.on('DOM.childNodeRemoved', (event) => this.events.send('childNodeRemoved', event))
      this.adapter.on('DOM.distributedNodesUpdated', (event) => this.events.send('distributedNodesUpdated', event))
      this.adapter.on('DOM.documentUpdated', (event) => this.events.send('documentUpdated', event))
      this.adapter.on('DOM.inlineStyleInvalidated', (event) => this.events.send('inlineStyleInvalidated', event))
      this.adapter.on('DOM.pseudoElementAdded', (event) => this.events.send('pseudoElementAdded', event))
      this.adapter.on('DOM.pseudoElementRemoved', (event) => this.events.send('pseudoElementRemoved', event))
      this.adapter.on('DOM.setChildNodes', (event) => this.events.send('setChildNodes', event))
      this.adapter.on('DOM.shadowRootPopped', (event) => this.events.send('shadowRootPopped', event))
      this.adapter.on('DOM.shadowRootPushed', (event) => this.events.send('shadowRootPushed', event))
    }
    /** Collects class names for the node with given id and all of it's child nodes. */
    public collectClassNamesFromSubtree(request: DOM.CollectClassNamesFromSubtreeRequest): Promise<DOM.CollectClassNamesFromSubtreeResponse> {
      return this.adapter.call('DOM.collectClassNamesFromSubtree', request)
    }
    /** Creates a deep copy of the specified node and places it into the target container before the given anchor. */
    public copyTo(request: DOM.CopyToRequest): Promise<DOM.CopyToResponse> {
      return this.adapter.call('DOM.copyTo', request)
    }
    /** Describes node given its id, does not require domain to be enabled. Does not start tracking any objects, can be used for automation. */
    public describeNode(request: DOM.DescribeNodeRequest): Promise<DOM.DescribeNodeResponse> {
      return this.adapter.call('DOM.describeNode', request)
    }
    /** Disables DOM agent for the given page. */
    public disable(request: DOM.DisableRequest): Promise<DOM.DisableResponse> {
      return this.adapter.call('DOM.disable', request)
    }
    /** Discards search results from the session with the given id. `getSearchResults` should no longer be called for that search. */
    public discardSearchResults(request: DOM.DiscardSearchResultsRequest): Promise<DOM.DiscardSearchResultsResponse> {
      return this.adapter.call('DOM.discardSearchResults', request)
    }
    /** Enables DOM agent for the given page. */
    public enable(request: DOM.EnableRequest): Promise<DOM.EnableResponse> {
      return this.adapter.call('DOM.enable', request)
    }
    /** Focuses the given element. */
    public focus(request: DOM.FocusRequest): Promise<DOM.FocusResponse> {
      return this.adapter.call('DOM.focus', request)
    }
    /** Returns attributes for the specified node. */
    public getAttributes(request: DOM.GetAttributesRequest): Promise<DOM.GetAttributesResponse> {
      return this.adapter.call('DOM.getAttributes', request)
    }
    /** Returns boxes for the given node. */
    public getBoxModel(request: DOM.GetBoxModelRequest): Promise<DOM.GetBoxModelResponse> {
      return this.adapter.call('DOM.getBoxModel', request)
    }
    /** Returns quads that describe node position on the page. This method might return multiple quads for inline nodes. */
    public getContentQuads(request: DOM.GetContentQuadsRequest): Promise<DOM.GetContentQuadsResponse> {
      return this.adapter.call('DOM.getContentQuads', request)
    }
    /** Returns the root DOM node (and optionally the subtree) to the caller. */
    public getDocument(request: DOM.GetDocumentRequest): Promise<DOM.GetDocumentResponse> {
      return this.adapter.call('DOM.getDocument', request)
    }
    /** Returns the root DOM node (and optionally the subtree) to the caller. */
    public getFlattenedDocument(request: DOM.GetFlattenedDocumentRequest): Promise<DOM.GetFlattenedDocumentResponse> {
      return this.adapter.call('DOM.getFlattenedDocument', request)
    }
    /** Returns node id at given location. Depending on whether DOM domain is enabled, nodeId is either returned or not. */
    public getNodeForLocation(request: DOM.GetNodeForLocationRequest): Promise<DOM.GetNodeForLocationResponse> {
      return this.adapter.call('DOM.getNodeForLocation', request)
    }
    /** Returns node's HTML markup. */
    public getOuterHTML(request: DOM.GetOuterHTMLRequest): Promise<DOM.GetOuterHTMLResponse> {
      return this.adapter.call('DOM.getOuterHTML', request)
    }
    /** Returns the id of the nearest ancestor that is a relayout boundary. */
    public getRelayoutBoundary(request: DOM.GetRelayoutBoundaryRequest): Promise<DOM.GetRelayoutBoundaryResponse> {
      return this.adapter.call('DOM.getRelayoutBoundary', request)
    }
    /** Returns search results from given `fromIndex` to given `toIndex` from the search with the given identifier. */
    public getSearchResults(request: DOM.GetSearchResultsRequest): Promise<DOM.GetSearchResultsResponse> {
      return this.adapter.call('DOM.getSearchResults', request)
    }
    /** Hides any highlight. */
    public hideHighlight(request: DOM.HideHighlightRequest): Promise<DOM.HideHighlightResponse> {
      return this.adapter.call('DOM.hideHighlight', request)
    }
    /** Highlights DOM node. */
    public highlightNode(request: DOM.HighlightNodeRequest): Promise<DOM.HighlightNodeResponse> {
      return this.adapter.call('DOM.highlightNode', request)
    }
    /** Highlights given rectangle. */
    public highlightRect(request: DOM.HighlightRectRequest): Promise<DOM.HighlightRectResponse> {
      return this.adapter.call('DOM.highlightRect', request)
    }
    /** Marks last undoable state. */
    public markUndoableState(request: DOM.MarkUndoableStateRequest): Promise<DOM.MarkUndoableStateResponse> {
      return this.adapter.call('DOM.markUndoableState', request)
    }
    /** Moves node into the new container, places it before the given anchor. */
    public moveTo(request: DOM.MoveToRequest): Promise<DOM.MoveToResponse> {
      return this.adapter.call('DOM.moveTo', request)
    }
    /** Searches for a given string in the DOM tree. Use `getSearchResults` to access search results or `cancelSearch` to end this search session. */
    public performSearch(request: DOM.PerformSearchRequest): Promise<DOM.PerformSearchResponse> {
      return this.adapter.call('DOM.performSearch', request)
    }
    /** Requests that the node is sent to the caller given its path. // FIXME, use XPath */
    public pushNodeByPathToFrontend(request: DOM.PushNodeByPathToFrontendRequest): Promise<DOM.PushNodeByPathToFrontendResponse> {
      return this.adapter.call('DOM.pushNodeByPathToFrontend', request)
    }
    /** Requests that a batch of nodes is sent to the caller given their backend node ids. */
    public pushNodesByBackendIdsToFrontend(request: DOM.PushNodesByBackendIdsToFrontendRequest): Promise<DOM.PushNodesByBackendIdsToFrontendResponse> {
      return this.adapter.call('DOM.pushNodesByBackendIdsToFrontend', request)
    }
    /** Executes `querySelector` on a given node. */
    public querySelector(request: DOM.QuerySelectorRequest): Promise<DOM.QuerySelectorResponse> {
      return this.adapter.call('DOM.querySelector', request)
    }
    /** Executes `querySelectorAll` on a given node. */
    public querySelectorAll(request: DOM.QuerySelectorAllRequest): Promise<DOM.QuerySelectorAllResponse> {
      return this.adapter.call('DOM.querySelectorAll', request)
    }
    /** Re-does the last undone action. */
    public redo(request: DOM.RedoRequest): Promise<DOM.RedoResponse> {
      return this.adapter.call('DOM.redo', request)
    }
    /** Removes attribute with given name from an element with given id. */
    public removeAttribute(request: DOM.RemoveAttributeRequest): Promise<DOM.RemoveAttributeResponse> {
      return this.adapter.call('DOM.removeAttribute', request)
    }
    /** Removes node with given id. */
    public removeNode(request: DOM.RemoveNodeRequest): Promise<DOM.RemoveNodeResponse> {
      return this.adapter.call('DOM.removeNode', request)
    }
    /** Requests that children of the node with given id are returned to the caller in form of `setChildNodes` events where not only immediate children are retrieved, but all children down to the specified depth. */
    public requestChildNodes(request: DOM.RequestChildNodesRequest): Promise<DOM.RequestChildNodesResponse> {
      return this.adapter.call('DOM.requestChildNodes', request)
    }
    /** Requests that the node is sent to the caller given the JavaScript node object reference. All nodes that form the path from the node to the root are also sent to the client as a series of `setChildNodes` notifications. */
    public requestNode(request: DOM.RequestNodeRequest): Promise<DOM.RequestNodeResponse> {
      return this.adapter.call('DOM.requestNode', request)
    }
    /** Resolves the JavaScript node object for a given NodeId or BackendNodeId. */
    public resolveNode(request: DOM.ResolveNodeRequest): Promise<DOM.ResolveNodeResponse> {
      return this.adapter.call('DOM.resolveNode', request)
    }
    /** Sets attribute for an element with given id. */
    public setAttributeValue(request: DOM.SetAttributeValueRequest): Promise<DOM.SetAttributeValueResponse> {
      return this.adapter.call('DOM.setAttributeValue', request)
    }
    /** Sets attributes on element with given id. This method is useful when user edits some existing attribute value and types in several attribute name/value pairs. */
    public setAttributesAsText(request: DOM.SetAttributesAsTextRequest): Promise<DOM.SetAttributesAsTextResponse> {
      return this.adapter.call('DOM.setAttributesAsText', request)
    }
    /** Sets files for the given file input element. */
    public setFileInputFiles(request: DOM.SetFileInputFilesRequest): Promise<DOM.SetFileInputFilesResponse> {
      return this.adapter.call('DOM.setFileInputFiles', request)
    }
    /** Returns file information for the given File wrapper. */
    public getFileInfo(request: DOM.GetFileInfoRequest): Promise<DOM.GetFileInfoResponse> {
      return this.adapter.call('DOM.getFileInfo', request)
    }
    /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
    public setInspectedNode(request: DOM.SetInspectedNodeRequest): Promise<DOM.SetInspectedNodeResponse> {
      return this.adapter.call('DOM.setInspectedNode', request)
    }
    /** Sets node name for a node with given id. */
    public setNodeName(request: DOM.SetNodeNameRequest): Promise<DOM.SetNodeNameResponse> {
      return this.adapter.call('DOM.setNodeName', request)
    }
    /** Sets node value for a node with given id. */
    public setNodeValue(request: DOM.SetNodeValueRequest): Promise<DOM.SetNodeValueResponse> {
      return this.adapter.call('DOM.setNodeValue', request)
    }
    /** Sets node HTML markup, returns new node id. */
    public setOuterHTML(request: DOM.SetOuterHTMLRequest): Promise<DOM.SetOuterHTMLResponse> {
      return this.adapter.call('DOM.setOuterHTML', request)
    }
    /** Undoes the last performed action. */
    public undo(request: DOM.UndoRequest): Promise<DOM.UndoResponse> {
      return this.adapter.call('DOM.undo', request)
    }
    /** Returns iframe node that owns iframe with the given domain. */
    public getFrameOwner(request: DOM.GetFrameOwnerRequest): Promise<DOM.GetFrameOwnerResponse> {
      return this.adapter.call('DOM.getFrameOwner', request)
    }
    /** Fired when `Element`'s attribute is modified. */
    public on(event: 'attributeModified', handler: EventHandler<DOM.AttributeModifiedEvent>): EventListener
    /** Fired when `Element`'s attribute is removed. */
    public on(event: 'attributeRemoved', handler: EventHandler<DOM.AttributeRemovedEvent>): EventListener
    /** Mirrors `DOMCharacterDataModified` event. */
    public on(event: 'characterDataModified', handler: EventHandler<DOM.CharacterDataModifiedEvent>): EventListener
    /** Fired when `Container`'s child node count has changed. */
    public on(event: 'childNodeCountUpdated', handler: EventHandler<DOM.ChildNodeCountUpdatedEvent>): EventListener
    /** Mirrors `DOMNodeInserted` event. */
    public on(event: 'childNodeInserted', handler: EventHandler<DOM.ChildNodeInsertedEvent>): EventListener
    /** Mirrors `DOMNodeRemoved` event. */
    public on(event: 'childNodeRemoved', handler: EventHandler<DOM.ChildNodeRemovedEvent>): EventListener
    /** Called when distrubution is changed. */
    public on(event: 'distributedNodesUpdated', handler: EventHandler<DOM.DistributedNodesUpdatedEvent>): EventListener
    /** Fired when `Document` has been totally updated. Node ids are no longer valid. */
    public on(event: 'documentUpdated', handler: EventHandler<DOM.DocumentUpdatedEvent>): EventListener
    /** Fired when `Element`'s inline style is modified via a CSS property modification. */
    public on(event: 'inlineStyleInvalidated', handler: EventHandler<DOM.InlineStyleInvalidatedEvent>): EventListener
    /** Called when a pseudo element is added to an element. */
    public on(event: 'pseudoElementAdded', handler: EventHandler<DOM.PseudoElementAddedEvent>): EventListener
    /** Called when a pseudo element is removed from an element. */
    public on(event: 'pseudoElementRemoved', handler: EventHandler<DOM.PseudoElementRemovedEvent>): EventListener
    /** Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids. */
    public on(event: 'setChildNodes', handler: EventHandler<DOM.SetChildNodesEvent>): EventListener
    /** Called when shadow root is popped from the element. */
    public on(event: 'shadowRootPopped', handler: EventHandler<DOM.ShadowRootPoppedEvent>): EventListener
    /** Called when shadow root is pushed into the element. */
    public on(event: 'shadowRootPushed', handler: EventHandler<DOM.ShadowRootPushedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Fired when `Element`'s attribute is modified. */
    public once(event: 'attributeModified', handler: EventHandler<DOM.AttributeModifiedEvent>): EventListener
    /** Fired when `Element`'s attribute is removed. */
    public once(event: 'attributeRemoved', handler: EventHandler<DOM.AttributeRemovedEvent>): EventListener
    /** Mirrors `DOMCharacterDataModified` event. */
    public once(event: 'characterDataModified', handler: EventHandler<DOM.CharacterDataModifiedEvent>): EventListener
    /** Fired when `Container`'s child node count has changed. */
    public once(event: 'childNodeCountUpdated', handler: EventHandler<DOM.ChildNodeCountUpdatedEvent>): EventListener
    /** Mirrors `DOMNodeInserted` event. */
    public once(event: 'childNodeInserted', handler: EventHandler<DOM.ChildNodeInsertedEvent>): EventListener
    /** Mirrors `DOMNodeRemoved` event. */
    public once(event: 'childNodeRemoved', handler: EventHandler<DOM.ChildNodeRemovedEvent>): EventListener
    /** Called when distrubution is changed. */
    public once(event: 'distributedNodesUpdated', handler: EventHandler<DOM.DistributedNodesUpdatedEvent>): EventListener
    /** Fired when `Document` has been totally updated. Node ids are no longer valid. */
    public once(event: 'documentUpdated', handler: EventHandler<DOM.DocumentUpdatedEvent>): EventListener
    /** Fired when `Element`'s inline style is modified via a CSS property modification. */
    public once(event: 'inlineStyleInvalidated', handler: EventHandler<DOM.InlineStyleInvalidatedEvent>): EventListener
    /** Called when a pseudo element is added to an element. */
    public once(event: 'pseudoElementAdded', handler: EventHandler<DOM.PseudoElementAddedEvent>): EventListener
    /** Called when a pseudo element is removed from an element. */
    public once(event: 'pseudoElementRemoved', handler: EventHandler<DOM.PseudoElementRemovedEvent>): EventListener
    /** Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids. */
    public once(event: 'setChildNodes', handler: EventHandler<DOM.SetChildNodesEvent>): EventListener
    /** Called when shadow root is popped from the element. */
    public once(event: 'shadowRootPopped', handler: EventHandler<DOM.ShadowRootPoppedEvent>): EventListener
    /** Called when shadow root is pushed into the element. */
    public once(event: 'shadowRootPushed', handler: EventHandler<DOM.ShadowRootPushedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class DOMDebugger {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Returns event listeners of the given object. */
    public getEventListeners(request: DOMDebugger.GetEventListenersRequest): Promise<DOMDebugger.GetEventListenersResponse> {
      return this.adapter.call('DOMDebugger.getEventListeners', request)
    }
    /** Removes DOM breakpoint that was set using `setDOMBreakpoint`. */
    public removeDOMBreakpoint(request: DOMDebugger.RemoveDOMBreakpointRequest): Promise<DOMDebugger.RemoveDOMBreakpointResponse> {
      return this.adapter.call('DOMDebugger.removeDOMBreakpoint', request)
    }
    /** Removes breakpoint on particular DOM event. */
    public removeEventListenerBreakpoint(request: DOMDebugger.RemoveEventListenerBreakpointRequest): Promise<DOMDebugger.RemoveEventListenerBreakpointResponse> {
      return this.adapter.call('DOMDebugger.removeEventListenerBreakpoint', request)
    }
    /** Removes breakpoint on particular native event. */
    public removeInstrumentationBreakpoint(request: DOMDebugger.RemoveInstrumentationBreakpointRequest): Promise<DOMDebugger.RemoveInstrumentationBreakpointResponse> {
      return this.adapter.call('DOMDebugger.removeInstrumentationBreakpoint', request)
    }
    /** Removes breakpoint from XMLHttpRequest. */
    public removeXHRBreakpoint(request: DOMDebugger.RemoveXHRBreakpointRequest): Promise<DOMDebugger.RemoveXHRBreakpointResponse> {
      return this.adapter.call('DOMDebugger.removeXHRBreakpoint', request)
    }
    /** Sets breakpoint on particular operation with DOM. */
    public setDOMBreakpoint(request: DOMDebugger.SetDOMBreakpointRequest): Promise<DOMDebugger.SetDOMBreakpointResponse> {
      return this.adapter.call('DOMDebugger.setDOMBreakpoint', request)
    }
    /** Sets breakpoint on particular DOM event. */
    public setEventListenerBreakpoint(request: DOMDebugger.SetEventListenerBreakpointRequest): Promise<DOMDebugger.SetEventListenerBreakpointResponse> {
      return this.adapter.call('DOMDebugger.setEventListenerBreakpoint', request)
    }
    /** Sets breakpoint on particular native event. */
    public setInstrumentationBreakpoint(request: DOMDebugger.SetInstrumentationBreakpointRequest): Promise<DOMDebugger.SetInstrumentationBreakpointResponse> {
      return this.adapter.call('DOMDebugger.setInstrumentationBreakpoint', request)
    }
    /** Sets breakpoint on XMLHttpRequest. */
    public setXHRBreakpoint(request: DOMDebugger.SetXHRBreakpointRequest): Promise<DOMDebugger.SetXHRBreakpointResponse> {
      return this.adapter.call('DOMDebugger.setXHRBreakpoint', request)
    }
  }
  export class DOMSnapshot {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Disables DOM snapshot agent for the given page. */
    public disable(request: DOMSnapshot.DisableRequest): Promise<DOMSnapshot.DisableResponse> {
      return this.adapter.call('DOMSnapshot.disable', request)
    }
    /** Enables DOM snapshot agent for the given page. */
    public enable(request: DOMSnapshot.EnableRequest): Promise<DOMSnapshot.EnableResponse> {
      return this.adapter.call('DOMSnapshot.enable', request)
    }
    /** Returns a document snapshot, including the full DOM tree of the root node (including iframes, template contents, and imported documents) in a flattened array, as well as layout and white-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is flattened. */
    public getSnapshot(request: DOMSnapshot.GetSnapshotRequest): Promise<DOMSnapshot.GetSnapshotResponse> {
      return this.adapter.call('DOMSnapshot.getSnapshot', request)
    }
    /** Returns a document snapshot, including the full DOM tree of the root node (including iframes, template contents, and imported documents) in a flattened array, as well as layout and white-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is flattened. */
    public captureSnapshot(request: DOMSnapshot.CaptureSnapshotRequest): Promise<DOMSnapshot.CaptureSnapshotResponse> {
      return this.adapter.call('DOMSnapshot.captureSnapshot', request)
    }
  }
  export class DOMStorage {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('DOMStorage.domStorageItemAdded', (event) => this.events.send('domStorageItemAdded', event))
      this.adapter.on('DOMStorage.domStorageItemRemoved', (event) => this.events.send('domStorageItemRemoved', event))
      this.adapter.on('DOMStorage.domStorageItemUpdated', (event) => this.events.send('domStorageItemUpdated', event))
      this.adapter.on('DOMStorage.domStorageItemsCleared', (event) => this.events.send('domStorageItemsCleared', event))
    }

    public clear(request: DOMStorage.ClearRequest): Promise<DOMStorage.ClearResponse> {
      return this.adapter.call('DOMStorage.clear', request)
    }
    /** Disables storage tracking, prevents storage events from being sent to the client. */
    public disable(request: DOMStorage.DisableRequest): Promise<DOMStorage.DisableResponse> {
      return this.adapter.call('DOMStorage.disable', request)
    }
    /** Enables storage tracking, storage events will now be delivered to the client. */
    public enable(request: DOMStorage.EnableRequest): Promise<DOMStorage.EnableResponse> {
      return this.adapter.call('DOMStorage.enable', request)
    }

    public getDOMStorageItems(request: DOMStorage.GetDOMStorageItemsRequest): Promise<DOMStorage.GetDOMStorageItemsResponse> {
      return this.adapter.call('DOMStorage.getDOMStorageItems', request)
    }

    public removeDOMStorageItem(request: DOMStorage.RemoveDOMStorageItemRequest): Promise<DOMStorage.RemoveDOMStorageItemResponse> {
      return this.adapter.call('DOMStorage.removeDOMStorageItem', request)
    }

    public setDOMStorageItem(request: DOMStorage.SetDOMStorageItemRequest): Promise<DOMStorage.SetDOMStorageItemResponse> {
      return this.adapter.call('DOMStorage.setDOMStorageItem', request)
    }

    public on(event: 'domStorageItemAdded', handler: EventHandler<DOMStorage.DomStorageItemAddedEvent>): EventListener

    public on(event: 'domStorageItemRemoved', handler: EventHandler<DOMStorage.DomStorageItemRemovedEvent>): EventListener

    public on(event: 'domStorageItemUpdated', handler: EventHandler<DOMStorage.DomStorageItemUpdatedEvent>): EventListener

    public on(event: 'domStorageItemsCleared', handler: EventHandler<DOMStorage.DomStorageItemsClearedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'domStorageItemAdded', handler: EventHandler<DOMStorage.DomStorageItemAddedEvent>): EventListener

    public once(event: 'domStorageItemRemoved', handler: EventHandler<DOMStorage.DomStorageItemRemovedEvent>): EventListener

    public once(event: 'domStorageItemUpdated', handler: EventHandler<DOMStorage.DomStorageItemUpdatedEvent>): EventListener

    public once(event: 'domStorageItemsCleared', handler: EventHandler<DOMStorage.DomStorageItemsClearedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Database {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Database.addDatabase', (event) => this.events.send('addDatabase', event))
    }
    /** Disables database tracking, prevents database events from being sent to the client. */
    public disable(request: Database.DisableRequest): Promise<Database.DisableResponse> {
      return this.adapter.call('Database.disable', request)
    }
    /** Enables database tracking, database events will now be delivered to the client. */
    public enable(request: Database.EnableRequest): Promise<Database.EnableResponse> {
      return this.adapter.call('Database.enable', request)
    }

    public executeSQL(request: Database.ExecuteSQLRequest): Promise<Database.ExecuteSQLResponse> {
      return this.adapter.call('Database.executeSQL', request)
    }

    public getDatabaseTableNames(request: Database.GetDatabaseTableNamesRequest): Promise<Database.GetDatabaseTableNamesResponse> {
      return this.adapter.call('Database.getDatabaseTableNames', request)
    }

    public on(event: 'addDatabase', handler: EventHandler<Database.AddDatabaseEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'addDatabase', handler: EventHandler<Database.AddDatabaseEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class DeviceOrientation {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Clears the overridden Device Orientation. */
    public clearDeviceOrientationOverride(request: DeviceOrientation.ClearDeviceOrientationOverrideRequest): Promise<DeviceOrientation.ClearDeviceOrientationOverrideResponse> {
      return this.adapter.call('DeviceOrientation.clearDeviceOrientationOverride', request)
    }
    /** Overrides the Device Orientation. */
    public setDeviceOrientationOverride(request: DeviceOrientation.SetDeviceOrientationOverrideRequest): Promise<DeviceOrientation.SetDeviceOrientationOverrideResponse> {
      return this.adapter.call('DeviceOrientation.setDeviceOrientationOverride', request)
    }
  }
  export class Emulation {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Emulation.virtualTimeBudgetExpired', (event) => this.events.send('virtualTimeBudgetExpired', event))
    }
    /** Tells whether emulation is supported. */
    public canEmulate(request: Emulation.CanEmulateRequest): Promise<Emulation.CanEmulateResponse> {
      return this.adapter.call('Emulation.canEmulate', request)
    }
    /** Clears the overriden device metrics. */
    public clearDeviceMetricsOverride(request: Emulation.ClearDeviceMetricsOverrideRequest): Promise<Emulation.ClearDeviceMetricsOverrideResponse> {
      return this.adapter.call('Emulation.clearDeviceMetricsOverride', request)
    }
    /** Clears the overriden Geolocation Position and Error. */
    public clearGeolocationOverride(request: Emulation.ClearGeolocationOverrideRequest): Promise<Emulation.ClearGeolocationOverrideResponse> {
      return this.adapter.call('Emulation.clearGeolocationOverride', request)
    }
    /** Requests that page scale factor is reset to initial values. */
    public resetPageScaleFactor(request: Emulation.ResetPageScaleFactorRequest): Promise<Emulation.ResetPageScaleFactorResponse> {
      return this.adapter.call('Emulation.resetPageScaleFactor', request)
    }
    /** Enables or disables simulating a focused and active page. */
    public setFocusEmulationEnabled(request: Emulation.SetFocusEmulationEnabledRequest): Promise<Emulation.SetFocusEmulationEnabledResponse> {
      return this.adapter.call('Emulation.setFocusEmulationEnabled', request)
    }
    /** Enables CPU throttling to emulate slow CPUs. */
    public setCPUThrottlingRate(request: Emulation.SetCPUThrottlingRateRequest): Promise<Emulation.SetCPUThrottlingRateResponse> {
      return this.adapter.call('Emulation.setCPUThrottlingRate', request)
    }
    /** Sets or clears an override of the default background color of the frame. This override is used if the content does not specify one. */
    public setDefaultBackgroundColorOverride(request: Emulation.SetDefaultBackgroundColorOverrideRequest): Promise<Emulation.SetDefaultBackgroundColorOverrideResponse> {
      return this.adapter.call('Emulation.setDefaultBackgroundColorOverride', request)
    }
    /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
    public setDeviceMetricsOverride(request: Emulation.SetDeviceMetricsOverrideRequest): Promise<Emulation.SetDeviceMetricsOverrideResponse> {
      return this.adapter.call('Emulation.setDeviceMetricsOverride', request)
    }

    public setScrollbarsHidden(request: Emulation.SetScrollbarsHiddenRequest): Promise<Emulation.SetScrollbarsHiddenResponse> {
      return this.adapter.call('Emulation.setScrollbarsHidden', request)
    }

    public setDocumentCookieDisabled(request: Emulation.SetDocumentCookieDisabledRequest): Promise<Emulation.SetDocumentCookieDisabledResponse> {
      return this.adapter.call('Emulation.setDocumentCookieDisabled', request)
    }

    public setEmitTouchEventsForMouse(request: Emulation.SetEmitTouchEventsForMouseRequest): Promise<Emulation.SetEmitTouchEventsForMouseResponse> {
      return this.adapter.call('Emulation.setEmitTouchEventsForMouse', request)
    }
    /** Emulates the given media for CSS media queries. */
    public setEmulatedMedia(request: Emulation.SetEmulatedMediaRequest): Promise<Emulation.SetEmulatedMediaResponse> {
      return this.adapter.call('Emulation.setEmulatedMedia', request)
    }
    /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
    public setGeolocationOverride(request: Emulation.SetGeolocationOverrideRequest): Promise<Emulation.SetGeolocationOverrideResponse> {
      return this.adapter.call('Emulation.setGeolocationOverride', request)
    }
    /** Overrides value returned by the javascript navigator object. */
    public setNavigatorOverrides(request: Emulation.SetNavigatorOverridesRequest): Promise<Emulation.SetNavigatorOverridesResponse> {
      return this.adapter.call('Emulation.setNavigatorOverrides', request)
    }
    /** Sets a specified page scale factor. */
    public setPageScaleFactor(request: Emulation.SetPageScaleFactorRequest): Promise<Emulation.SetPageScaleFactorResponse> {
      return this.adapter.call('Emulation.setPageScaleFactor', request)
    }
    /** Switches script execution in the page. */
    public setScriptExecutionDisabled(request: Emulation.SetScriptExecutionDisabledRequest): Promise<Emulation.SetScriptExecutionDisabledResponse> {
      return this.adapter.call('Emulation.setScriptExecutionDisabled', request)
    }
    /** Enables touch on platforms which do not support them. */
    public setTouchEmulationEnabled(request: Emulation.SetTouchEmulationEnabledRequest): Promise<Emulation.SetTouchEmulationEnabledResponse> {
      return this.adapter.call('Emulation.setTouchEmulationEnabled', request)
    }
    /** Turns on virtual time for all frames (replacing real-time with a synthetic time source) and sets the current virtual time policy.  Note this supersedes any previous time budget. */
    public setVirtualTimePolicy(request: Emulation.SetVirtualTimePolicyRequest): Promise<Emulation.SetVirtualTimePolicyResponse> {
      return this.adapter.call('Emulation.setVirtualTimePolicy', request)
    }
    /** Overrides default host system timezone with the specified one. */
    public setTimezoneOverride(request: Emulation.SetTimezoneOverrideRequest): Promise<Emulation.SetTimezoneOverrideResponse> {
      return this.adapter.call('Emulation.setTimezoneOverride', request)
    }
    /** Resizes the frame/viewport of the page. Note that this does not affect the frame's container (e.g. browser window). Can be used to produce screenshots of the specified size. Not supported on Android. */
    public setVisibleSize(request: Emulation.SetVisibleSizeRequest): Promise<Emulation.SetVisibleSizeResponse> {
      return this.adapter.call('Emulation.setVisibleSize', request)
    }
    /** Allows overriding user agent with the given string. */
    public setUserAgentOverride(request: Emulation.SetUserAgentOverrideRequest): Promise<Emulation.SetUserAgentOverrideResponse> {
      return this.adapter.call('Emulation.setUserAgentOverride', request)
    }
    /** Notification sent after the virtual time budget for the current VirtualTimePolicy has run out. */
    public on(event: 'virtualTimeBudgetExpired', handler: EventHandler<Emulation.VirtualTimeBudgetExpiredEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Notification sent after the virtual time budget for the current VirtualTimePolicy has run out. */
    public once(event: 'virtualTimeBudgetExpired', handler: EventHandler<Emulation.VirtualTimeBudgetExpiredEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class HeadlessExperimental {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('HeadlessExperimental.needsBeginFramesChanged', (event) => this.events.send('needsBeginFramesChanged', event))
    }
    /** Sends a BeginFrame to the target and returns when the frame was completed. Optionally captures a screenshot from the resulting frame. Requires that the target was created with enabled BeginFrameControl. Designed for use with --run-all-compositor-stages-before-draw, see also https://goo.gl/3zHXhB for more background. */
    public beginFrame(request: HeadlessExperimental.BeginFrameRequest): Promise<HeadlessExperimental.BeginFrameResponse> {
      return this.adapter.call('HeadlessExperimental.beginFrame', request)
    }
    /** Disables headless events for the target. */
    public disable(request: HeadlessExperimental.DisableRequest): Promise<HeadlessExperimental.DisableResponse> {
      return this.adapter.call('HeadlessExperimental.disable', request)
    }
    /** Enables headless events for the target. */
    public enable(request: HeadlessExperimental.EnableRequest): Promise<HeadlessExperimental.EnableResponse> {
      return this.adapter.call('HeadlessExperimental.enable', request)
    }
    /** Issued when the target starts or stops needing BeginFrames. */
    public on(event: 'needsBeginFramesChanged', handler: EventHandler<HeadlessExperimental.NeedsBeginFramesChangedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Issued when the target starts or stops needing BeginFrames. */
    public once(event: 'needsBeginFramesChanged', handler: EventHandler<HeadlessExperimental.NeedsBeginFramesChangedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class IO {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Close the stream, discard any temporary backing storage. */
    public close(request: IO.CloseRequest): Promise<IO.CloseResponse> {
      return this.adapter.call('IO.close', request)
    }
    /** Read a chunk of the stream */
    public read(request: IO.ReadRequest): Promise<IO.ReadResponse> {
      return this.adapter.call('IO.read', request)
    }
    /** Return UUID of Blob object specified by a remote object id. */
    public resolveBlob(request: IO.ResolveBlobRequest): Promise<IO.ResolveBlobResponse> {
      return this.adapter.call('IO.resolveBlob', request)
    }
  }
  export class IndexedDB {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Clears all entries from an object store. */
    public clearObjectStore(request: IndexedDB.ClearObjectStoreRequest): Promise<IndexedDB.ClearObjectStoreResponse> {
      return this.adapter.call('IndexedDB.clearObjectStore', request)
    }
    /** Deletes a database. */
    public deleteDatabase(request: IndexedDB.DeleteDatabaseRequest): Promise<IndexedDB.DeleteDatabaseResponse> {
      return this.adapter.call('IndexedDB.deleteDatabase', request)
    }
    /** Delete a range of entries from an object store */
    public deleteObjectStoreEntries(request: IndexedDB.DeleteObjectStoreEntriesRequest): Promise<IndexedDB.DeleteObjectStoreEntriesResponse> {
      return this.adapter.call('IndexedDB.deleteObjectStoreEntries', request)
    }
    /** Disables events from backend. */
    public disable(request: IndexedDB.DisableRequest): Promise<IndexedDB.DisableResponse> {
      return this.adapter.call('IndexedDB.disable', request)
    }
    /** Enables events from backend. */
    public enable(request: IndexedDB.EnableRequest): Promise<IndexedDB.EnableResponse> {
      return this.adapter.call('IndexedDB.enable', request)
    }
    /** Requests data from object store or index. */
    public requestData(request: IndexedDB.RequestDataRequest): Promise<IndexedDB.RequestDataResponse> {
      return this.adapter.call('IndexedDB.requestData', request)
    }
    /** Gets metadata of an object store */
    public getMetadata(request: IndexedDB.GetMetadataRequest): Promise<IndexedDB.GetMetadataResponse> {
      return this.adapter.call('IndexedDB.getMetadata', request)
    }
    /** Requests database with given name in given frame. */
    public requestDatabase(request: IndexedDB.RequestDatabaseRequest): Promise<IndexedDB.RequestDatabaseResponse> {
      return this.adapter.call('IndexedDB.requestDatabase', request)
    }
    /** Requests database names for given security origin. */
    public requestDatabaseNames(request: IndexedDB.RequestDatabaseNamesRequest): Promise<IndexedDB.RequestDatabaseNamesResponse> {
      return this.adapter.call('IndexedDB.requestDatabaseNames', request)
    }
  }
  export class Input {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Dispatches a key event to the page. */
    public dispatchKeyEvent(request: Input.DispatchKeyEventRequest): Promise<Input.DispatchKeyEventResponse> {
      return this.adapter.call('Input.dispatchKeyEvent', request)
    }
    /** This method emulates inserting text that doesn't come from a key press, for example an emoji keyboard or an IME. */
    public insertText(request: Input.InsertTextRequest): Promise<Input.InsertTextResponse> {
      return this.adapter.call('Input.insertText', request)
    }
    /** Dispatches a mouse event to the page. */
    public dispatchMouseEvent(request: Input.DispatchMouseEventRequest): Promise<Input.DispatchMouseEventResponse> {
      return this.adapter.call('Input.dispatchMouseEvent', request)
    }
    /** Dispatches a touch event to the page. */
    public dispatchTouchEvent(request: Input.DispatchTouchEventRequest): Promise<Input.DispatchTouchEventResponse> {
      return this.adapter.call('Input.dispatchTouchEvent', request)
    }
    /** Emulates touch event from the mouse event parameters. */
    public emulateTouchFromMouseEvent(request: Input.EmulateTouchFromMouseEventRequest): Promise<Input.EmulateTouchFromMouseEventResponse> {
      return this.adapter.call('Input.emulateTouchFromMouseEvent', request)
    }
    /** Ignores input events (useful while auditing page). */
    public setIgnoreInputEvents(request: Input.SetIgnoreInputEventsRequest): Promise<Input.SetIgnoreInputEventsResponse> {
      return this.adapter.call('Input.setIgnoreInputEvents', request)
    }
    /** Synthesizes a pinch gesture over a time period by issuing appropriate touch events. */
    public synthesizePinchGesture(request: Input.SynthesizePinchGestureRequest): Promise<Input.SynthesizePinchGestureResponse> {
      return this.adapter.call('Input.synthesizePinchGesture', request)
    }
    /** Synthesizes a scroll gesture over a time period by issuing appropriate touch events. */
    public synthesizeScrollGesture(request: Input.SynthesizeScrollGestureRequest): Promise<Input.SynthesizeScrollGestureResponse> {
      return this.adapter.call('Input.synthesizeScrollGesture', request)
    }
    /** Synthesizes a tap gesture over a time period by issuing appropriate touch events. */
    public synthesizeTapGesture(request: Input.SynthesizeTapGestureRequest): Promise<Input.SynthesizeTapGestureResponse> {
      return this.adapter.call('Input.synthesizeTapGesture', request)
    }
  }
  export class Inspector {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Inspector.detached', (event) => this.events.send('detached', event))
      this.adapter.on('Inspector.targetCrashed', (event) => this.events.send('targetCrashed', event))
      this.adapter.on('Inspector.targetReloadedAfterCrash', (event) => this.events.send('targetReloadedAfterCrash', event))
    }
    /** Disables inspector domain notifications. */
    public disable(request: Inspector.DisableRequest): Promise<Inspector.DisableResponse> {
      return this.adapter.call('Inspector.disable', request)
    }
    /** Enables inspector domain notifications. */
    public enable(request: Inspector.EnableRequest): Promise<Inspector.EnableResponse> {
      return this.adapter.call('Inspector.enable', request)
    }
    /** Fired when remote debugging connection is about to be terminated. Contains detach reason. */
    public on(event: 'detached', handler: EventHandler<Inspector.DetachedEvent>): EventListener
    /** Fired when debugging target has crashed */
    public on(event: 'targetCrashed', handler: EventHandler<Inspector.TargetCrashedEvent>): EventListener
    /** Fired when debugging target has reloaded after crash */
    public on(event: 'targetReloadedAfterCrash', handler: EventHandler<Inspector.TargetReloadedAfterCrashEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Fired when remote debugging connection is about to be terminated. Contains detach reason. */
    public once(event: 'detached', handler: EventHandler<Inspector.DetachedEvent>): EventListener
    /** Fired when debugging target has crashed */
    public once(event: 'targetCrashed', handler: EventHandler<Inspector.TargetCrashedEvent>): EventListener
    /** Fired when debugging target has reloaded after crash */
    public once(event: 'targetReloadedAfterCrash', handler: EventHandler<Inspector.TargetReloadedAfterCrashEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class LayerTree {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('LayerTree.layerPainted', (event) => this.events.send('layerPainted', event))
      this.adapter.on('LayerTree.layerTreeDidChange', (event) => this.events.send('layerTreeDidChange', event))
    }
    /** Provides the reasons why the given layer was composited. */
    public compositingReasons(request: LayerTree.CompositingReasonsRequest): Promise<LayerTree.CompositingReasonsResponse> {
      return this.adapter.call('LayerTree.compositingReasons', request)
    }
    /** Disables compositing tree inspection. */
    public disable(request: LayerTree.DisableRequest): Promise<LayerTree.DisableResponse> {
      return this.adapter.call('LayerTree.disable', request)
    }
    /** Enables compositing tree inspection. */
    public enable(request: LayerTree.EnableRequest): Promise<LayerTree.EnableResponse> {
      return this.adapter.call('LayerTree.enable', request)
    }
    /** Returns the snapshot identifier. */
    public loadSnapshot(request: LayerTree.LoadSnapshotRequest): Promise<LayerTree.LoadSnapshotResponse> {
      return this.adapter.call('LayerTree.loadSnapshot', request)
    }
    /** Returns the layer snapshot identifier. */
    public makeSnapshot(request: LayerTree.MakeSnapshotRequest): Promise<LayerTree.MakeSnapshotResponse> {
      return this.adapter.call('LayerTree.makeSnapshot', request)
    }

    public profileSnapshot(request: LayerTree.ProfileSnapshotRequest): Promise<LayerTree.ProfileSnapshotResponse> {
      return this.adapter.call('LayerTree.profileSnapshot', request)
    }
    /** Releases layer snapshot captured by the back-end. */
    public releaseSnapshot(request: LayerTree.ReleaseSnapshotRequest): Promise<LayerTree.ReleaseSnapshotResponse> {
      return this.adapter.call('LayerTree.releaseSnapshot', request)
    }
    /** Replays the layer snapshot and returns the resulting bitmap. */
    public replaySnapshot(request: LayerTree.ReplaySnapshotRequest): Promise<LayerTree.ReplaySnapshotResponse> {
      return this.adapter.call('LayerTree.replaySnapshot', request)
    }
    /** Replays the layer snapshot and returns canvas log. */
    public snapshotCommandLog(request: LayerTree.SnapshotCommandLogRequest): Promise<LayerTree.SnapshotCommandLogResponse> {
      return this.adapter.call('LayerTree.snapshotCommandLog', request)
    }

    public on(event: 'layerPainted', handler: EventHandler<LayerTree.LayerPaintedEvent>): EventListener

    public on(event: 'layerTreeDidChange', handler: EventHandler<LayerTree.LayerTreeDidChangeEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'layerPainted', handler: EventHandler<LayerTree.LayerPaintedEvent>): EventListener

    public once(event: 'layerTreeDidChange', handler: EventHandler<LayerTree.LayerTreeDidChangeEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Log {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Log.entryAdded', (event) => this.events.send('entryAdded', event))
    }
    /** Clears the log. */
    public clear(request: Log.ClearRequest): Promise<Log.ClearResponse> {
      return this.adapter.call('Log.clear', request)
    }
    /** Disables log domain, prevents further log entries from being reported to the client. */
    public disable(request: Log.DisableRequest): Promise<Log.DisableResponse> {
      return this.adapter.call('Log.disable', request)
    }
    /** Enables log domain, sends the entries collected so far to the client by means of the `entryAdded` notification. */
    public enable(request: Log.EnableRequest): Promise<Log.EnableResponse> {
      return this.adapter.call('Log.enable', request)
    }
    /** start violation reporting. */
    public startViolationsReport(request: Log.StartViolationsReportRequest): Promise<Log.StartViolationsReportResponse> {
      return this.adapter.call('Log.startViolationsReport', request)
    }
    /** Stop violation reporting. */
    public stopViolationsReport(request: Log.StopViolationsReportRequest): Promise<Log.StopViolationsReportResponse> {
      return this.adapter.call('Log.stopViolationsReport', request)
    }
    /** Issued when new message was logged. */
    public on(event: 'entryAdded', handler: EventHandler<Log.EntryAddedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Issued when new message was logged. */
    public once(event: 'entryAdded', handler: EventHandler<Log.EntryAddedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Memory {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }

    public getDOMCounters(request: Memory.GetDOMCountersRequest): Promise<Memory.GetDOMCountersResponse> {
      return this.adapter.call('Memory.getDOMCounters', request)
    }

    public prepareForLeakDetection(request: Memory.PrepareForLeakDetectionRequest): Promise<Memory.PrepareForLeakDetectionResponse> {
      return this.adapter.call('Memory.prepareForLeakDetection', request)
    }
    /** Simulate OomIntervention by purging V8 memory. */
    public forciblyPurgeJavaScriptMemory(request: Memory.ForciblyPurgeJavaScriptMemoryRequest): Promise<Memory.ForciblyPurgeJavaScriptMemoryResponse> {
      return this.adapter.call('Memory.forciblyPurgeJavaScriptMemory', request)
    }
    /** Enable/disable suppressing memory pressure notifications in all processes. */
    public setPressureNotificationsSuppressed(request: Memory.SetPressureNotificationsSuppressedRequest): Promise<Memory.SetPressureNotificationsSuppressedResponse> {
      return this.adapter.call('Memory.setPressureNotificationsSuppressed', request)
    }
    /** Simulate a memory pressure notification in all processes. */
    public simulatePressureNotification(request: Memory.SimulatePressureNotificationRequest): Promise<Memory.SimulatePressureNotificationResponse> {
      return this.adapter.call('Memory.simulatePressureNotification', request)
    }
    /** Start collecting native memory profile. */
    public startSampling(request: Memory.StartSamplingRequest): Promise<Memory.StartSamplingResponse> {
      return this.adapter.call('Memory.startSampling', request)
    }
    /** Stop collecting native memory profile. */
    public stopSampling(request: Memory.StopSamplingRequest): Promise<Memory.StopSamplingResponse> {
      return this.adapter.call('Memory.stopSampling', request)
    }
    /** Retrieve native memory allocations profile collected since renderer process startup. */
    public getAllTimeSamplingProfile(request: Memory.GetAllTimeSamplingProfileRequest): Promise<Memory.GetAllTimeSamplingProfileResponse> {
      return this.adapter.call('Memory.getAllTimeSamplingProfile', request)
    }
    /** Retrieve native memory allocations profile collected since browser process startup. */
    public getBrowserSamplingProfile(request: Memory.GetBrowserSamplingProfileRequest): Promise<Memory.GetBrowserSamplingProfileResponse> {
      return this.adapter.call('Memory.getBrowserSamplingProfile', request)
    }
    /** Retrieve native memory allocations profile collected since last `startSampling` call. */
    public getSamplingProfile(request: Memory.GetSamplingProfileRequest): Promise<Memory.GetSamplingProfileResponse> {
      return this.adapter.call('Memory.getSamplingProfile', request)
    }
  }
  export class Network {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Network.dataReceived', (event) => this.events.send('dataReceived', event))
      this.adapter.on('Network.eventSourceMessageReceived', (event) => this.events.send('eventSourceMessageReceived', event))
      this.adapter.on('Network.loadingFailed', (event) => this.events.send('loadingFailed', event))
      this.adapter.on('Network.loadingFinished', (event) => this.events.send('loadingFinished', event))
      this.adapter.on('Network.requestIntercepted', (event) => this.events.send('requestIntercepted', event))
      this.adapter.on('Network.requestServedFromCache', (event) => this.events.send('requestServedFromCache', event))
      this.adapter.on('Network.requestWillBeSent', (event) => this.events.send('requestWillBeSent', event))
      this.adapter.on('Network.resourceChangedPriority', (event) => this.events.send('resourceChangedPriority', event))
      this.adapter.on('Network.signedExchangeReceived', (event) => this.events.send('signedExchangeReceived', event))
      this.adapter.on('Network.responseReceived', (event) => this.events.send('responseReceived', event))
      this.adapter.on('Network.webSocketClosed', (event) => this.events.send('webSocketClosed', event))
      this.adapter.on('Network.webSocketCreated', (event) => this.events.send('webSocketCreated', event))
      this.adapter.on('Network.webSocketFrameError', (event) => this.events.send('webSocketFrameError', event))
      this.adapter.on('Network.webSocketFrameReceived', (event) => this.events.send('webSocketFrameReceived', event))
      this.adapter.on('Network.webSocketFrameSent', (event) => this.events.send('webSocketFrameSent', event))
      this.adapter.on('Network.webSocketHandshakeResponseReceived', (event) => this.events.send('webSocketHandshakeResponseReceived', event))
      this.adapter.on('Network.webSocketWillSendHandshakeRequest', (event) => this.events.send('webSocketWillSendHandshakeRequest', event))
    }
    /** Tells whether clearing browser cache is supported. */
    public canClearBrowserCache(request: Network.CanClearBrowserCacheRequest): Promise<Network.CanClearBrowserCacheResponse> {
      return this.adapter.call('Network.canClearBrowserCache', request)
    }
    /** Tells whether clearing browser cookies is supported. */
    public canClearBrowserCookies(request: Network.CanClearBrowserCookiesRequest): Promise<Network.CanClearBrowserCookiesResponse> {
      return this.adapter.call('Network.canClearBrowserCookies', request)
    }
    /** Tells whether emulation of network conditions is supported. */
    public canEmulateNetworkConditions(request: Network.CanEmulateNetworkConditionsRequest): Promise<Network.CanEmulateNetworkConditionsResponse> {
      return this.adapter.call('Network.canEmulateNetworkConditions', request)
    }
    /** Clears browser cache. */
    public clearBrowserCache(request: Network.ClearBrowserCacheRequest): Promise<Network.ClearBrowserCacheResponse> {
      return this.adapter.call('Network.clearBrowserCache', request)
    }
    /** Clears browser cookies. */
    public clearBrowserCookies(request: Network.ClearBrowserCookiesRequest): Promise<Network.ClearBrowserCookiesResponse> {
      return this.adapter.call('Network.clearBrowserCookies', request)
    }
    /** Response to Network.requestIntercepted which either modifies the request to continue with any modifications, or blocks it, or completes it with the provided response bytes. If a network fetch occurs as a result which encounters a redirect an additional Network.requestIntercepted event will be sent with the same InterceptionId. Deprecated, use Fetch.continueRequest, Fetch.fulfillRequest and Fetch.failRequest instead. */
    public continueInterceptedRequest(request: Network.ContinueInterceptedRequestRequest): Promise<Network.ContinueInterceptedRequestResponse> {
      return this.adapter.call('Network.continueInterceptedRequest', request)
    }
    /** Deletes browser cookies with matching name and url or domain/path pair. */
    public deleteCookies(request: Network.DeleteCookiesRequest): Promise<Network.DeleteCookiesResponse> {
      return this.adapter.call('Network.deleteCookies', request)
    }
    /** Disables network tracking, prevents network events from being sent to the client. */
    public disable(request: Network.DisableRequest): Promise<Network.DisableResponse> {
      return this.adapter.call('Network.disable', request)
    }
    /** Activates emulation of network conditions. */
    public emulateNetworkConditions(request: Network.EmulateNetworkConditionsRequest): Promise<Network.EmulateNetworkConditionsResponse> {
      return this.adapter.call('Network.emulateNetworkConditions', request)
    }
    /** Enables network tracking, network events will now be delivered to the client. */
    public enable(request: Network.EnableRequest): Promise<Network.EnableResponse> {
      return this.adapter.call('Network.enable', request)
    }
    /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the `cookies` field. */
    public getAllCookies(request: Network.GetAllCookiesRequest): Promise<Network.GetAllCookiesResponse> {
      return this.adapter.call('Network.getAllCookies', request)
    }
    /** Returns the DER-encoded certificate. */
    public getCertificate(request: Network.GetCertificateRequest): Promise<Network.GetCertificateResponse> {
      return this.adapter.call('Network.getCertificate', request)
    }
    /** Returns all browser cookies for the current URL. Depending on the backend support, will return detailed cookie information in the `cookies` field. */
    public getCookies(request: Network.GetCookiesRequest): Promise<Network.GetCookiesResponse> {
      return this.adapter.call('Network.getCookies', request)
    }
    /** Returns content served for the given request. */
    public getResponseBody(request: Network.GetResponseBodyRequest): Promise<Network.GetResponseBodyResponse> {
      return this.adapter.call('Network.getResponseBody', request)
    }
    /** Returns post data sent with the request. Returns an error when no data was sent with the request. */
    public getRequestPostData(request: Network.GetRequestPostDataRequest): Promise<Network.GetRequestPostDataResponse> {
      return this.adapter.call('Network.getRequestPostData', request)
    }
    /** Returns content served for the given currently intercepted request. */
    public getResponseBodyForInterception(request: Network.GetResponseBodyForInterceptionRequest): Promise<Network.GetResponseBodyForInterceptionResponse> {
      return this.adapter.call('Network.getResponseBodyForInterception', request)
    }
    /** Returns a handle to the stream representing the response body. Note that after this command, the intercepted request can't be continued as is -- you either need to cancel it or to provide the response body. The stream only supports sequential read, IO.read will fail if the position is specified. */
    public takeResponseBodyForInterceptionAsStream(
      request: Network.TakeResponseBodyForInterceptionAsStreamRequest,
    ): Promise<Network.TakeResponseBodyForInterceptionAsStreamResponse> {
      return this.adapter.call('Network.takeResponseBodyForInterceptionAsStream', request)
    }
    /** This method sends a new XMLHttpRequest which is identical to the original one. The following parameters should be identical: method, url, async, request body, extra headers, withCredentials attribute, user, password. */
    public replayXHR(request: Network.ReplayXHRRequest): Promise<Network.ReplayXHRResponse> {
      return this.adapter.call('Network.replayXHR', request)
    }
    /** Searches for given string in response content. */
    public searchInResponseBody(request: Network.SearchInResponseBodyRequest): Promise<Network.SearchInResponseBodyResponse> {
      return this.adapter.call('Network.searchInResponseBody', request)
    }
    /** Blocks URLs from loading. */
    public setBlockedURLs(request: Network.SetBlockedURLsRequest): Promise<Network.SetBlockedURLsResponse> {
      return this.adapter.call('Network.setBlockedURLs', request)
    }
    /** Toggles ignoring of service worker for each request. */
    public setBypassServiceWorker(request: Network.SetBypassServiceWorkerRequest): Promise<Network.SetBypassServiceWorkerResponse> {
      return this.adapter.call('Network.setBypassServiceWorker', request)
    }
    /** Toggles ignoring cache for each request. If `true`, cache will not be used. */
    public setCacheDisabled(request: Network.SetCacheDisabledRequest): Promise<Network.SetCacheDisabledResponse> {
      return this.adapter.call('Network.setCacheDisabled', request)
    }
    /** Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist. */
    public setCookie(request: Network.SetCookieRequest): Promise<Network.SetCookieResponse> {
      return this.adapter.call('Network.setCookie', request)
    }
    /** Sets given cookies. */
    public setCookies(request: Network.SetCookiesRequest): Promise<Network.SetCookiesResponse> {
      return this.adapter.call('Network.setCookies', request)
    }
    /** For testing. */
    public setDataSizeLimitsForTest(request: Network.SetDataSizeLimitsForTestRequest): Promise<Network.SetDataSizeLimitsForTestResponse> {
      return this.adapter.call('Network.setDataSizeLimitsForTest', request)
    }
    /** Specifies whether to always send extra HTTP headers with the requests from this page. */
    public setExtraHTTPHeaders(request: Network.SetExtraHTTPHeadersRequest): Promise<Network.SetExtraHTTPHeadersResponse> {
      return this.adapter.call('Network.setExtraHTTPHeaders', request)
    }
    /** Sets the requests to intercept that match the provided patterns and optionally resource types. Deprecated, please use Fetch.enable instead. */
    public setRequestInterception(request: Network.SetRequestInterceptionRequest): Promise<Network.SetRequestInterceptionResponse> {
      return this.adapter.call('Network.setRequestInterception', request)
    }
    /** Allows overriding user agent with the given string. */
    public setUserAgentOverride(request: Network.SetUserAgentOverrideRequest): Promise<Network.SetUserAgentOverrideResponse> {
      return this.adapter.call('Network.setUserAgentOverride', request)
    }
    /** Fired when data chunk was received over the network. */
    public on(event: 'dataReceived', handler: EventHandler<Network.DataReceivedEvent>): EventListener
    /** Fired when EventSource message is received. */
    public on(event: 'eventSourceMessageReceived', handler: EventHandler<Network.EventSourceMessageReceivedEvent>): EventListener
    /** Fired when HTTP request has failed to load. */
    public on(event: 'loadingFailed', handler: EventHandler<Network.LoadingFailedEvent>): EventListener
    /** Fired when HTTP request has finished loading. */
    public on(event: 'loadingFinished', handler: EventHandler<Network.LoadingFinishedEvent>): EventListener
    /** Details of an intercepted HTTP request, which must be either allowed, blocked, modified or mocked. Deprecated, use Fetch.requestPaused instead. */
    public on(event: 'requestIntercepted', handler: EventHandler<Network.RequestInterceptedEvent>): EventListener
    /** Fired if request ended up loading from cache. */
    public on(event: 'requestServedFromCache', handler: EventHandler<Network.RequestServedFromCacheEvent>): EventListener
    /** Fired when page is about to send HTTP request. */
    public on(event: 'requestWillBeSent', handler: EventHandler<Network.RequestWillBeSentEvent>): EventListener
    /** Fired when resource loading priority is changed */
    public on(event: 'resourceChangedPriority', handler: EventHandler<Network.ResourceChangedPriorityEvent>): EventListener
    /** Fired when a signed exchange was received over the network */
    public on(event: 'signedExchangeReceived', handler: EventHandler<Network.SignedExchangeReceivedEvent>): EventListener
    /** Fired when HTTP response is available. */
    public on(event: 'responseReceived', handler: EventHandler<Network.ResponseReceivedEvent>): EventListener
    /** Fired when WebSocket is closed. */
    public on(event: 'webSocketClosed', handler: EventHandler<Network.WebSocketClosedEvent>): EventListener
    /** Fired upon WebSocket creation. */
    public on(event: 'webSocketCreated', handler: EventHandler<Network.WebSocketCreatedEvent>): EventListener
    /** Fired when WebSocket message error occurs. */
    public on(event: 'webSocketFrameError', handler: EventHandler<Network.WebSocketFrameErrorEvent>): EventListener
    /** Fired when WebSocket message is received. */
    public on(event: 'webSocketFrameReceived', handler: EventHandler<Network.WebSocketFrameReceivedEvent>): EventListener
    /** Fired when WebSocket message is sent. */
    public on(event: 'webSocketFrameSent', handler: EventHandler<Network.WebSocketFrameSentEvent>): EventListener
    /** Fired when WebSocket handshake response becomes available. */
    public on(event: 'webSocketHandshakeResponseReceived', handler: EventHandler<Network.WebSocketHandshakeResponseReceivedEvent>): EventListener
    /** Fired when WebSocket is about to initiate handshake. */
    public on(event: 'webSocketWillSendHandshakeRequest', handler: EventHandler<Network.WebSocketWillSendHandshakeRequestEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Fired when data chunk was received over the network. */
    public once(event: 'dataReceived', handler: EventHandler<Network.DataReceivedEvent>): EventListener
    /** Fired when EventSource message is received. */
    public once(event: 'eventSourceMessageReceived', handler: EventHandler<Network.EventSourceMessageReceivedEvent>): EventListener
    /** Fired when HTTP request has failed to load. */
    public once(event: 'loadingFailed', handler: EventHandler<Network.LoadingFailedEvent>): EventListener
    /** Fired when HTTP request has finished loading. */
    public once(event: 'loadingFinished', handler: EventHandler<Network.LoadingFinishedEvent>): EventListener
    /** Details of an intercepted HTTP request, which must be either allowed, blocked, modified or mocked. Deprecated, use Fetch.requestPaused instead. */
    public once(event: 'requestIntercepted', handler: EventHandler<Network.RequestInterceptedEvent>): EventListener
    /** Fired if request ended up loading from cache. */
    public once(event: 'requestServedFromCache', handler: EventHandler<Network.RequestServedFromCacheEvent>): EventListener
    /** Fired when page is about to send HTTP request. */
    public once(event: 'requestWillBeSent', handler: EventHandler<Network.RequestWillBeSentEvent>): EventListener
    /** Fired when resource loading priority is changed */
    public once(event: 'resourceChangedPriority', handler: EventHandler<Network.ResourceChangedPriorityEvent>): EventListener
    /** Fired when a signed exchange was received over the network */
    public once(event: 'signedExchangeReceived', handler: EventHandler<Network.SignedExchangeReceivedEvent>): EventListener
    /** Fired when HTTP response is available. */
    public once(event: 'responseReceived', handler: EventHandler<Network.ResponseReceivedEvent>): EventListener
    /** Fired when WebSocket is closed. */
    public once(event: 'webSocketClosed', handler: EventHandler<Network.WebSocketClosedEvent>): EventListener
    /** Fired upon WebSocket creation. */
    public once(event: 'webSocketCreated', handler: EventHandler<Network.WebSocketCreatedEvent>): EventListener
    /** Fired when WebSocket message error occurs. */
    public once(event: 'webSocketFrameError', handler: EventHandler<Network.WebSocketFrameErrorEvent>): EventListener
    /** Fired when WebSocket message is received. */
    public once(event: 'webSocketFrameReceived', handler: EventHandler<Network.WebSocketFrameReceivedEvent>): EventListener
    /** Fired when WebSocket message is sent. */
    public once(event: 'webSocketFrameSent', handler: EventHandler<Network.WebSocketFrameSentEvent>): EventListener
    /** Fired when WebSocket handshake response becomes available. */
    public once(event: 'webSocketHandshakeResponseReceived', handler: EventHandler<Network.WebSocketHandshakeResponseReceivedEvent>): EventListener
    /** Fired when WebSocket is about to initiate handshake. */
    public once(event: 'webSocketWillSendHandshakeRequest', handler: EventHandler<Network.WebSocketWillSendHandshakeRequestEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Overlay {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Overlay.inspectNodeRequested', (event) => this.events.send('inspectNodeRequested', event))
      this.adapter.on('Overlay.nodeHighlightRequested', (event) => this.events.send('nodeHighlightRequested', event))
      this.adapter.on('Overlay.screenshotRequested', (event) => this.events.send('screenshotRequested', event))
      this.adapter.on('Overlay.inspectModeCanceled', (event) => this.events.send('inspectModeCanceled', event))
    }
    /** Disables domain notifications. */
    public disable(request: Overlay.DisableRequest): Promise<Overlay.DisableResponse> {
      return this.adapter.call('Overlay.disable', request)
    }
    /** Enables domain notifications. */
    public enable(request: Overlay.EnableRequest): Promise<Overlay.EnableResponse> {
      return this.adapter.call('Overlay.enable', request)
    }
    /** For testing. */
    public getHighlightObjectForTest(request: Overlay.GetHighlightObjectForTestRequest): Promise<Overlay.GetHighlightObjectForTestResponse> {
      return this.adapter.call('Overlay.getHighlightObjectForTest', request)
    }
    /** Hides any highlight. */
    public hideHighlight(request: Overlay.HideHighlightRequest): Promise<Overlay.HideHighlightResponse> {
      return this.adapter.call('Overlay.hideHighlight', request)
    }
    /** Highlights owner element of the frame with given id. */
    public highlightFrame(request: Overlay.HighlightFrameRequest): Promise<Overlay.HighlightFrameResponse> {
      return this.adapter.call('Overlay.highlightFrame', request)
    }
    /** Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or objectId must be specified. */
    public highlightNode(request: Overlay.HighlightNodeRequest): Promise<Overlay.HighlightNodeResponse> {
      return this.adapter.call('Overlay.highlightNode', request)
    }
    /** Highlights given quad. Coordinates are absolute with respect to the main frame viewport. */
    public highlightQuad(request: Overlay.HighlightQuadRequest): Promise<Overlay.HighlightQuadResponse> {
      return this.adapter.call('Overlay.highlightQuad', request)
    }
    /** Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport. */
    public highlightRect(request: Overlay.HighlightRectRequest): Promise<Overlay.HighlightRectResponse> {
      return this.adapter.call('Overlay.highlightRect', request)
    }
    /** Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted. Backend then generates 'inspectNodeRequested' event upon element selection. */
    public setInspectMode(request: Overlay.SetInspectModeRequest): Promise<Overlay.SetInspectModeResponse> {
      return this.adapter.call('Overlay.setInspectMode', request)
    }
    /** Highlights owner element of all frames detected to be ads. */
    public setShowAdHighlights(request: Overlay.SetShowAdHighlightsRequest): Promise<Overlay.SetShowAdHighlightsResponse> {
      return this.adapter.call('Overlay.setShowAdHighlights', request)
    }

    public setPausedInDebuggerMessage(request: Overlay.SetPausedInDebuggerMessageRequest): Promise<Overlay.SetPausedInDebuggerMessageResponse> {
      return this.adapter.call('Overlay.setPausedInDebuggerMessage', request)
    }
    /** Requests that backend shows debug borders on layers */
    public setShowDebugBorders(request: Overlay.SetShowDebugBordersRequest): Promise<Overlay.SetShowDebugBordersResponse> {
      return this.adapter.call('Overlay.setShowDebugBorders', request)
    }
    /** Requests that backend shows the FPS counter */
    public setShowFPSCounter(request: Overlay.SetShowFPSCounterRequest): Promise<Overlay.SetShowFPSCounterResponse> {
      return this.adapter.call('Overlay.setShowFPSCounter', request)
    }
    /** Requests that backend shows paint rectangles */
    public setShowPaintRects(request: Overlay.SetShowPaintRectsRequest): Promise<Overlay.SetShowPaintRectsResponse> {
      return this.adapter.call('Overlay.setShowPaintRects', request)
    }
    /** Requests that backend shows layout shift regions */
    public setShowLayoutShiftRegions(request: Overlay.SetShowLayoutShiftRegionsRequest): Promise<Overlay.SetShowLayoutShiftRegionsResponse> {
      return this.adapter.call('Overlay.setShowLayoutShiftRegions', request)
    }
    /** Requests that backend shows scroll bottleneck rects */
    public setShowScrollBottleneckRects(request: Overlay.SetShowScrollBottleneckRectsRequest): Promise<Overlay.SetShowScrollBottleneckRectsResponse> {
      return this.adapter.call('Overlay.setShowScrollBottleneckRects', request)
    }
    /** Requests that backend shows hit-test borders on layers */
    public setShowHitTestBorders(request: Overlay.SetShowHitTestBordersRequest): Promise<Overlay.SetShowHitTestBordersResponse> {
      return this.adapter.call('Overlay.setShowHitTestBorders', request)
    }
    /** Paints viewport size upon main frame resize. */
    public setShowViewportSizeOnResize(request: Overlay.SetShowViewportSizeOnResizeRequest): Promise<Overlay.SetShowViewportSizeOnResizeResponse> {
      return this.adapter.call('Overlay.setShowViewportSizeOnResize', request)
    }
    /** Fired when the node should be inspected. This happens after call to `setInspectMode` or when user manually inspects an element. */
    public on(event: 'inspectNodeRequested', handler: EventHandler<Overlay.InspectNodeRequestedEvent>): EventListener
    /** Fired when the node should be highlighted. This happens after call to `setInspectMode`. */
    public on(event: 'nodeHighlightRequested', handler: EventHandler<Overlay.NodeHighlightRequestedEvent>): EventListener
    /** Fired when user asks to capture screenshot of some area on the page. */
    public on(event: 'screenshotRequested', handler: EventHandler<Overlay.ScreenshotRequestedEvent>): EventListener
    /** Fired when user cancels the inspect mode. */
    public on(event: 'inspectModeCanceled', handler: EventHandler<Overlay.InspectModeCanceledEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Fired when the node should be inspected. This happens after call to `setInspectMode` or when user manually inspects an element. */
    public once(event: 'inspectNodeRequested', handler: EventHandler<Overlay.InspectNodeRequestedEvent>): EventListener
    /** Fired when the node should be highlighted. This happens after call to `setInspectMode`. */
    public once(event: 'nodeHighlightRequested', handler: EventHandler<Overlay.NodeHighlightRequestedEvent>): EventListener
    /** Fired when user asks to capture screenshot of some area on the page. */
    public once(event: 'screenshotRequested', handler: EventHandler<Overlay.ScreenshotRequestedEvent>): EventListener
    /** Fired when user cancels the inspect mode. */
    public once(event: 'inspectModeCanceled', handler: EventHandler<Overlay.InspectModeCanceledEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Page {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Page.domContentEventFired', (event) => this.events.send('domContentEventFired', event))
      this.adapter.on('Page.fileChooserOpened', (event) => this.events.send('fileChooserOpened', event))
      this.adapter.on('Page.frameAttached', (event) => this.events.send('frameAttached', event))
      this.adapter.on('Page.frameClearedScheduledNavigation', (event) => this.events.send('frameClearedScheduledNavigation', event))
      this.adapter.on('Page.frameDetached', (event) => this.events.send('frameDetached', event))
      this.adapter.on('Page.frameNavigated', (event) => this.events.send('frameNavigated', event))
      this.adapter.on('Page.frameResized', (event) => this.events.send('frameResized', event))
      this.adapter.on('Page.frameRequestedNavigation', (event) => this.events.send('frameRequestedNavigation', event))
      this.adapter.on('Page.frameScheduledNavigation', (event) => this.events.send('frameScheduledNavigation', event))
      this.adapter.on('Page.frameStartedLoading', (event) => this.events.send('frameStartedLoading', event))
      this.adapter.on('Page.frameStoppedLoading', (event) => this.events.send('frameStoppedLoading', event))
      this.adapter.on('Page.downloadWillBegin', (event) => this.events.send('downloadWillBegin', event))
      this.adapter.on('Page.interstitialHidden', (event) => this.events.send('interstitialHidden', event))
      this.adapter.on('Page.interstitialShown', (event) => this.events.send('interstitialShown', event))
      this.adapter.on('Page.javascriptDialogClosed', (event) => this.events.send('javascriptDialogClosed', event))
      this.adapter.on('Page.javascriptDialogOpening', (event) => this.events.send('javascriptDialogOpening', event))
      this.adapter.on('Page.lifecycleEvent', (event) => this.events.send('lifecycleEvent', event))
      this.adapter.on('Page.loadEventFired', (event) => this.events.send('loadEventFired', event))
      this.adapter.on('Page.navigatedWithinDocument', (event) => this.events.send('navigatedWithinDocument', event))
      this.adapter.on('Page.screencastFrame', (event) => this.events.send('screencastFrame', event))
      this.adapter.on('Page.screencastVisibilityChanged', (event) => this.events.send('screencastVisibilityChanged', event))
      this.adapter.on('Page.windowOpen', (event) => this.events.send('windowOpen', event))
      this.adapter.on('Page.compilationCacheProduced', (event) => this.events.send('compilationCacheProduced', event))
    }
    /** Deprecated, please use addScriptToEvaluateOnNewDocument instead. */
    public addScriptToEvaluateOnLoad(request: Page.AddScriptToEvaluateOnLoadRequest): Promise<Page.AddScriptToEvaluateOnLoadResponse> {
      return this.adapter.call('Page.addScriptToEvaluateOnLoad', request)
    }
    /** Evaluates given script in every frame upon creation (before loading frame's scripts). */
    public addScriptToEvaluateOnNewDocument(request: Page.AddScriptToEvaluateOnNewDocumentRequest): Promise<Page.AddScriptToEvaluateOnNewDocumentResponse> {
      return this.adapter.call('Page.addScriptToEvaluateOnNewDocument', request)
    }
    /** Brings page to front (activates tab). */
    public bringToFront(request: Page.BringToFrontRequest): Promise<Page.BringToFrontResponse> {
      return this.adapter.call('Page.bringToFront', request)
    }
    /** Capture page screenshot. */
    public captureScreenshot(request: Page.CaptureScreenshotRequest): Promise<Page.CaptureScreenshotResponse> {
      return this.adapter.call('Page.captureScreenshot', request)
    }
    /** Returns a snapshot of the page as a string. For MHTML format, the serialization includes iframes, shadow DOM, external resources, and element-inline styles. */
    public captureSnapshot(request: Page.CaptureSnapshotRequest): Promise<Page.CaptureSnapshotResponse> {
      return this.adapter.call('Page.captureSnapshot', request)
    }
    /** Clears the overriden device metrics. */
    public clearDeviceMetricsOverride(request: Page.ClearDeviceMetricsOverrideRequest): Promise<Page.ClearDeviceMetricsOverrideResponse> {
      return this.adapter.call('Page.clearDeviceMetricsOverride', request)
    }
    /** Clears the overridden Device Orientation. */
    public clearDeviceOrientationOverride(request: Page.ClearDeviceOrientationOverrideRequest): Promise<Page.ClearDeviceOrientationOverrideResponse> {
      return this.adapter.call('Page.clearDeviceOrientationOverride', request)
    }
    /** Clears the overriden Geolocation Position and Error. */
    public clearGeolocationOverride(request: Page.ClearGeolocationOverrideRequest): Promise<Page.ClearGeolocationOverrideResponse> {
      return this.adapter.call('Page.clearGeolocationOverride', request)
    }
    /** Creates an isolated world for the given frame. */
    public createIsolatedWorld(request: Page.CreateIsolatedWorldRequest): Promise<Page.CreateIsolatedWorldResponse> {
      return this.adapter.call('Page.createIsolatedWorld', request)
    }
    /** Deletes browser cookie with given name, domain and path. */
    public deleteCookie(request: Page.DeleteCookieRequest): Promise<Page.DeleteCookieResponse> {
      return this.adapter.call('Page.deleteCookie', request)
    }
    /** Disables page domain notifications. */
    public disable(request: Page.DisableRequest): Promise<Page.DisableResponse> {
      return this.adapter.call('Page.disable', request)
    }
    /** Enables page domain notifications. */
    public enable(request: Page.EnableRequest): Promise<Page.EnableResponse> {
      return this.adapter.call('Page.enable', request)
    }

    public getAppManifest(request: Page.GetAppManifestRequest): Promise<Page.GetAppManifestResponse> {
      return this.adapter.call('Page.getAppManifest', request)
    }

    public getInstallabilityErrors(request: Page.GetInstallabilityErrorsRequest): Promise<Page.GetInstallabilityErrorsResponse> {
      return this.adapter.call('Page.getInstallabilityErrors', request)
    }
    /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the `cookies` field. */
    public getCookies(request: Page.GetCookiesRequest): Promise<Page.GetCookiesResponse> {
      return this.adapter.call('Page.getCookies', request)
    }
    /** Returns present frame tree structure. */
    public getFrameTree(request: Page.GetFrameTreeRequest): Promise<Page.GetFrameTreeResponse> {
      return this.adapter.call('Page.getFrameTree', request)
    }
    /** Returns metrics relating to the layouting of the page, such as viewport bounds/scale. */
    public getLayoutMetrics(request: Page.GetLayoutMetricsRequest): Promise<Page.GetLayoutMetricsResponse> {
      return this.adapter.call('Page.getLayoutMetrics', request)
    }
    /** Returns navigation history for the current page. */
    public getNavigationHistory(request: Page.GetNavigationHistoryRequest): Promise<Page.GetNavigationHistoryResponse> {
      return this.adapter.call('Page.getNavigationHistory', request)
    }
    /** Resets navigation history for the current page. */
    public resetNavigationHistory(request: Page.ResetNavigationHistoryRequest): Promise<Page.ResetNavigationHistoryResponse> {
      return this.adapter.call('Page.resetNavigationHistory', request)
    }
    /** Returns content of the given resource. */
    public getResourceContent(request: Page.GetResourceContentRequest): Promise<Page.GetResourceContentResponse> {
      return this.adapter.call('Page.getResourceContent', request)
    }
    /** Returns present frame / resource tree structure. */
    public getResourceTree(request: Page.GetResourceTreeRequest): Promise<Page.GetResourceTreeResponse> {
      return this.adapter.call('Page.getResourceTree', request)
    }
    /** Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload). */
    public handleJavaScriptDialog(request: Page.HandleJavaScriptDialogRequest): Promise<Page.HandleJavaScriptDialogResponse> {
      return this.adapter.call('Page.handleJavaScriptDialog', request)
    }
    /** Navigates current page to the given URL. */
    public navigate(request: Page.NavigateRequest): Promise<Page.NavigateResponse> {
      return this.adapter.call('Page.navigate', request)
    }
    /** Navigates current page to the given history entry. */
    public navigateToHistoryEntry(request: Page.NavigateToHistoryEntryRequest): Promise<Page.NavigateToHistoryEntryResponse> {
      return this.adapter.call('Page.navigateToHistoryEntry', request)
    }
    /** Print page as PDF. */
    public printToPDF(request: Page.PrintToPDFRequest): Promise<Page.PrintToPDFResponse> {
      return this.adapter.call('Page.printToPDF', request)
    }
    /** Reloads given page optionally ignoring the cache. */
    public reload(request: Page.ReloadRequest): Promise<Page.ReloadResponse> {
      return this.adapter.call('Page.reload', request)
    }
    /** Deprecated, please use removeScriptToEvaluateOnNewDocument instead. */
    public removeScriptToEvaluateOnLoad(request: Page.RemoveScriptToEvaluateOnLoadRequest): Promise<Page.RemoveScriptToEvaluateOnLoadResponse> {
      return this.adapter.call('Page.removeScriptToEvaluateOnLoad', request)
    }
    /** Removes given script from the list. */
    public removeScriptToEvaluateOnNewDocument(request: Page.RemoveScriptToEvaluateOnNewDocumentRequest): Promise<Page.RemoveScriptToEvaluateOnNewDocumentResponse> {
      return this.adapter.call('Page.removeScriptToEvaluateOnNewDocument', request)
    }
    /** Acknowledges that a screencast frame has been received by the frontend. */
    public screencastFrameAck(request: Page.ScreencastFrameAckRequest): Promise<Page.ScreencastFrameAckResponse> {
      return this.adapter.call('Page.screencastFrameAck', request)
    }
    /** Searches for given string in resource content. */
    public searchInResource(request: Page.SearchInResourceRequest): Promise<Page.SearchInResourceResponse> {
      return this.adapter.call('Page.searchInResource', request)
    }
    /** Enable Chrome's experimental ad filter on all sites. */
    public setAdBlockingEnabled(request: Page.SetAdBlockingEnabledRequest): Promise<Page.SetAdBlockingEnabledResponse> {
      return this.adapter.call('Page.setAdBlockingEnabled', request)
    }
    /** Enable page Content Security Policy by-passing. */
    public setBypassCSP(request: Page.SetBypassCSPRequest): Promise<Page.SetBypassCSPResponse> {
      return this.adapter.call('Page.setBypassCSP', request)
    }
    /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
    public setDeviceMetricsOverride(request: Page.SetDeviceMetricsOverrideRequest): Promise<Page.SetDeviceMetricsOverrideResponse> {
      return this.adapter.call('Page.setDeviceMetricsOverride', request)
    }
    /** Overrides the Device Orientation. */
    public setDeviceOrientationOverride(request: Page.SetDeviceOrientationOverrideRequest): Promise<Page.SetDeviceOrientationOverrideResponse> {
      return this.adapter.call('Page.setDeviceOrientationOverride', request)
    }
    /** Set generic font families. */
    public setFontFamilies(request: Page.SetFontFamiliesRequest): Promise<Page.SetFontFamiliesResponse> {
      return this.adapter.call('Page.setFontFamilies', request)
    }
    /** Set default font sizes. */
    public setFontSizes(request: Page.SetFontSizesRequest): Promise<Page.SetFontSizesResponse> {
      return this.adapter.call('Page.setFontSizes', request)
    }
    /** Sets given markup as the document's HTML. */
    public setDocumentContent(request: Page.SetDocumentContentRequest): Promise<Page.SetDocumentContentResponse> {
      return this.adapter.call('Page.setDocumentContent', request)
    }
    /** Set the behavior when downloading a file. */
    public setDownloadBehavior(request: Page.SetDownloadBehaviorRequest): Promise<Page.SetDownloadBehaviorResponse> {
      return this.adapter.call('Page.setDownloadBehavior', request)
    }
    /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
    public setGeolocationOverride(request: Page.SetGeolocationOverrideRequest): Promise<Page.SetGeolocationOverrideResponse> {
      return this.adapter.call('Page.setGeolocationOverride', request)
    }
    /** Controls whether page will emit lifecycle events. */
    public setLifecycleEventsEnabled(request: Page.SetLifecycleEventsEnabledRequest): Promise<Page.SetLifecycleEventsEnabledResponse> {
      return this.adapter.call('Page.setLifecycleEventsEnabled', request)
    }
    /** Toggles mouse event-based touch event emulation. */
    public setTouchEmulationEnabled(request: Page.SetTouchEmulationEnabledRequest): Promise<Page.SetTouchEmulationEnabledResponse> {
      return this.adapter.call('Page.setTouchEmulationEnabled', request)
    }
    /** Starts sending each frame using the `screencastFrame` event. */
    public startScreencast(request: Page.StartScreencastRequest): Promise<Page.StartScreencastResponse> {
      return this.adapter.call('Page.startScreencast', request)
    }
    /** Force the page stop all navigations and pending resource fetches. */
    public stopLoading(request: Page.StopLoadingRequest): Promise<Page.StopLoadingResponse> {
      return this.adapter.call('Page.stopLoading', request)
    }
    /** Crashes renderer on the IO thread, generates minidumps. */
    public crash(request: Page.CrashRequest): Promise<Page.CrashResponse> {
      return this.adapter.call('Page.crash', request)
    }
    /** Tries to close page, running its beforeunload hooks, if any. */
    public close(request: Page.CloseRequest): Promise<Page.CloseResponse> {
      return this.adapter.call('Page.close', request)
    }
    /** Tries to update the web lifecycle state of the page. It will transition the page to the given state according to: https://github.com/WICG/web-lifecycle/ */
    public setWebLifecycleState(request: Page.SetWebLifecycleStateRequest): Promise<Page.SetWebLifecycleStateResponse> {
      return this.adapter.call('Page.setWebLifecycleState', request)
    }
    /** Stops sending each frame in the `screencastFrame`. */
    public stopScreencast(request: Page.StopScreencastRequest): Promise<Page.StopScreencastResponse> {
      return this.adapter.call('Page.stopScreencast', request)
    }
    /** Forces compilation cache to be generated for every subresource script. */
    public setProduceCompilationCache(request: Page.SetProduceCompilationCacheRequest): Promise<Page.SetProduceCompilationCacheResponse> {
      return this.adapter.call('Page.setProduceCompilationCache', request)
    }
    /** Seeds compilation cache for given url. Compilation cache does not survive cross-process navigation. */
    public addCompilationCache(request: Page.AddCompilationCacheRequest): Promise<Page.AddCompilationCacheResponse> {
      return this.adapter.call('Page.addCompilationCache', request)
    }
    /** Clears seeded compilation cache. */
    public clearCompilationCache(request: Page.ClearCompilationCacheRequest): Promise<Page.ClearCompilationCacheResponse> {
      return this.adapter.call('Page.clearCompilationCache', request)
    }
    /** Generates a report for testing. */
    public generateTestReport(request: Page.GenerateTestReportRequest): Promise<Page.GenerateTestReportResponse> {
      return this.adapter.call('Page.generateTestReport', request)
    }
    /** Pauses page execution. Can be resumed using generic Runtime.runIfWaitingForDebugger. */
    public waitForDebugger(request: Page.WaitForDebuggerRequest): Promise<Page.WaitForDebuggerResponse> {
      return this.adapter.call('Page.waitForDebugger', request)
    }
    /** Intercept file chooser requests and transfer control to protocol clients. When file chooser interception is enabled, native file chooser dialog is not shown. Instead, a protocol event `Page.fileChooserOpened` is emitted. File chooser can be handled with `page.handleFileChooser` command. */
    public setInterceptFileChooserDialog(request: Page.SetInterceptFileChooserDialogRequest): Promise<Page.SetInterceptFileChooserDialogResponse> {
      return this.adapter.call('Page.setInterceptFileChooserDialog', request)
    }
    /** Accepts or cancels an intercepted file chooser dialog. */
    public handleFileChooser(request: Page.HandleFileChooserRequest): Promise<Page.HandleFileChooserResponse> {
      return this.adapter.call('Page.handleFileChooser', request)
    }

    public on(event: 'domContentEventFired', handler: EventHandler<Page.DomContentEventFiredEvent>): EventListener
    /** Emitted only when `page.interceptFileChooser` is enabled. */
    public on(event: 'fileChooserOpened', handler: EventHandler<Page.FileChooserOpenedEvent>): EventListener
    /** Fired when frame has been attached to its parent. */
    public on(event: 'frameAttached', handler: EventHandler<Page.FrameAttachedEvent>): EventListener
    /** Fired when frame no longer has a scheduled navigation. */
    public on(event: 'frameClearedScheduledNavigation', handler: EventHandler<Page.FrameClearedScheduledNavigationEvent>): EventListener
    /** Fired when frame has been detached from its parent. */
    public on(event: 'frameDetached', handler: EventHandler<Page.FrameDetachedEvent>): EventListener
    /** Fired once navigation of the frame has completed. Frame is now associated with the new loader. */
    public on(event: 'frameNavigated', handler: EventHandler<Page.FrameNavigatedEvent>): EventListener

    public on(event: 'frameResized', handler: EventHandler<Page.FrameResizedEvent>): EventListener
    /** Fired when a renderer-initiated navigation is requested. Navigation may still be cancelled after the event is issued. */
    public on(event: 'frameRequestedNavigation', handler: EventHandler<Page.FrameRequestedNavigationEvent>): EventListener
    /** Fired when frame schedules a potential navigation. */
    public on(event: 'frameScheduledNavigation', handler: EventHandler<Page.FrameScheduledNavigationEvent>): EventListener
    /** Fired when frame has started loading. */
    public on(event: 'frameStartedLoading', handler: EventHandler<Page.FrameStartedLoadingEvent>): EventListener
    /** Fired when frame has stopped loading. */
    public on(event: 'frameStoppedLoading', handler: EventHandler<Page.FrameStoppedLoadingEvent>): EventListener
    /** Fired when page is about to start a download. */
    public on(event: 'downloadWillBegin', handler: EventHandler<Page.DownloadWillBeginEvent>): EventListener
    /** Fired when interstitial page was hidden */
    public on(event: 'interstitialHidden', handler: EventHandler<Page.InterstitialHiddenEvent>): EventListener
    /** Fired when interstitial page was shown */
    public on(event: 'interstitialShown', handler: EventHandler<Page.InterstitialShownEvent>): EventListener
    /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed. */
    public on(event: 'javascriptDialogClosed', handler: EventHandler<Page.JavascriptDialogClosedEvent>): EventListener
    /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open. */
    public on(event: 'javascriptDialogOpening', handler: EventHandler<Page.JavascriptDialogOpeningEvent>): EventListener
    /** Fired for top level page lifecycle events such as navigation, load, paint, etc. */
    public on(event: 'lifecycleEvent', handler: EventHandler<Page.LifecycleEventEvent>): EventListener

    public on(event: 'loadEventFired', handler: EventHandler<Page.LoadEventFiredEvent>): EventListener
    /** Fired when same-document navigation happens, e.g. due to history API usage or anchor navigation. */
    public on(event: 'navigatedWithinDocument', handler: EventHandler<Page.NavigatedWithinDocumentEvent>): EventListener
    /** Compressed image data requested by the `startScreencast`. */
    public on(event: 'screencastFrame', handler: EventHandler<Page.ScreencastFrameEvent>): EventListener
    /** Fired when the page with currently enabled screencast was shown or hidden `. */
    public on(event: 'screencastVisibilityChanged', handler: EventHandler<Page.ScreencastVisibilityChangedEvent>): EventListener
    /** Fired when a new window is going to be opened, via window.open(), link click, form submission, etc. */
    public on(event: 'windowOpen', handler: EventHandler<Page.WindowOpenEvent>): EventListener
    /** Issued for every compilation cache generated. Is only available if Page.setGenerateCompilationCache is enabled. */
    public on(event: 'compilationCacheProduced', handler: EventHandler<Page.CompilationCacheProducedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'domContentEventFired', handler: EventHandler<Page.DomContentEventFiredEvent>): EventListener
    /** Emitted only when `page.interceptFileChooser` is enabled. */
    public once(event: 'fileChooserOpened', handler: EventHandler<Page.FileChooserOpenedEvent>): EventListener
    /** Fired when frame has been attached to its parent. */
    public once(event: 'frameAttached', handler: EventHandler<Page.FrameAttachedEvent>): EventListener
    /** Fired when frame no longer has a scheduled navigation. */
    public once(event: 'frameClearedScheduledNavigation', handler: EventHandler<Page.FrameClearedScheduledNavigationEvent>): EventListener
    /** Fired when frame has been detached from its parent. */
    public once(event: 'frameDetached', handler: EventHandler<Page.FrameDetachedEvent>): EventListener
    /** Fired once navigation of the frame has completed. Frame is now associated with the new loader. */
    public once(event: 'frameNavigated', handler: EventHandler<Page.FrameNavigatedEvent>): EventListener

    public once(event: 'frameResized', handler: EventHandler<Page.FrameResizedEvent>): EventListener
    /** Fired when a renderer-initiated navigation is requested. Navigation may still be cancelled after the event is issued. */
    public once(event: 'frameRequestedNavigation', handler: EventHandler<Page.FrameRequestedNavigationEvent>): EventListener
    /** Fired when frame schedules a potential navigation. */
    public once(event: 'frameScheduledNavigation', handler: EventHandler<Page.FrameScheduledNavigationEvent>): EventListener
    /** Fired when frame has started loading. */
    public once(event: 'frameStartedLoading', handler: EventHandler<Page.FrameStartedLoadingEvent>): EventListener
    /** Fired when frame has stopped loading. */
    public once(event: 'frameStoppedLoading', handler: EventHandler<Page.FrameStoppedLoadingEvent>): EventListener
    /** Fired when page is about to start a download. */
    public once(event: 'downloadWillBegin', handler: EventHandler<Page.DownloadWillBeginEvent>): EventListener
    /** Fired when interstitial page was hidden */
    public once(event: 'interstitialHidden', handler: EventHandler<Page.InterstitialHiddenEvent>): EventListener
    /** Fired when interstitial page was shown */
    public once(event: 'interstitialShown', handler: EventHandler<Page.InterstitialShownEvent>): EventListener
    /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed. */
    public once(event: 'javascriptDialogClosed', handler: EventHandler<Page.JavascriptDialogClosedEvent>): EventListener
    /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open. */
    public once(event: 'javascriptDialogOpening', handler: EventHandler<Page.JavascriptDialogOpeningEvent>): EventListener
    /** Fired for top level page lifecycle events such as navigation, load, paint, etc. */
    public once(event: 'lifecycleEvent', handler: EventHandler<Page.LifecycleEventEvent>): EventListener

    public once(event: 'loadEventFired', handler: EventHandler<Page.LoadEventFiredEvent>): EventListener
    /** Fired when same-document navigation happens, e.g. due to history API usage or anchor navigation. */
    public once(event: 'navigatedWithinDocument', handler: EventHandler<Page.NavigatedWithinDocumentEvent>): EventListener
    /** Compressed image data requested by the `startScreencast`. */
    public once(event: 'screencastFrame', handler: EventHandler<Page.ScreencastFrameEvent>): EventListener
    /** Fired when the page with currently enabled screencast was shown or hidden `. */
    public once(event: 'screencastVisibilityChanged', handler: EventHandler<Page.ScreencastVisibilityChangedEvent>): EventListener
    /** Fired when a new window is going to be opened, via window.open(), link click, form submission, etc. */
    public once(event: 'windowOpen', handler: EventHandler<Page.WindowOpenEvent>): EventListener
    /** Issued for every compilation cache generated. Is only available if Page.setGenerateCompilationCache is enabled. */
    public once(event: 'compilationCacheProduced', handler: EventHandler<Page.CompilationCacheProducedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Performance {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Performance.metrics', (event) => this.events.send('metrics', event))
    }
    /** Disable collecting and reporting metrics. */
    public disable(request: Performance.DisableRequest): Promise<Performance.DisableResponse> {
      return this.adapter.call('Performance.disable', request)
    }
    /** Enable collecting and reporting metrics. */
    public enable(request: Performance.EnableRequest): Promise<Performance.EnableResponse> {
      return this.adapter.call('Performance.enable', request)
    }
    /** Sets time domain to use for collecting and reporting duration metrics. Note that this must be called before enabling metrics collection. Calling this method while metrics collection is enabled returns an error. */
    public setTimeDomain(request: Performance.SetTimeDomainRequest): Promise<Performance.SetTimeDomainResponse> {
      return this.adapter.call('Performance.setTimeDomain', request)
    }
    /** Retrieve current values of run-time metrics. */
    public getMetrics(request: Performance.GetMetricsRequest): Promise<Performance.GetMetricsResponse> {
      return this.adapter.call('Performance.getMetrics', request)
    }
    /** Current values of the metrics. */
    public on(event: 'metrics', handler: EventHandler<Performance.MetricsEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Current values of the metrics. */
    public once(event: 'metrics', handler: EventHandler<Performance.MetricsEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Security {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Security.certificateError', (event) => this.events.send('certificateError', event))
      this.adapter.on('Security.securityStateChanged', (event) => this.events.send('securityStateChanged', event))
    }
    /** Disables tracking security state changes. */
    public disable(request: Security.DisableRequest): Promise<Security.DisableResponse> {
      return this.adapter.call('Security.disable', request)
    }
    /** Enables tracking security state changes. */
    public enable(request: Security.EnableRequest): Promise<Security.EnableResponse> {
      return this.adapter.call('Security.enable', request)
    }
    /** Enable/disable whether all certificate errors should be ignored. */
    public setIgnoreCertificateErrors(request: Security.SetIgnoreCertificateErrorsRequest): Promise<Security.SetIgnoreCertificateErrorsResponse> {
      return this.adapter.call('Security.setIgnoreCertificateErrors', request)
    }
    /** Handles a certificate error that fired a certificateError event. */
    public handleCertificateError(request: Security.HandleCertificateErrorRequest): Promise<Security.HandleCertificateErrorResponse> {
      return this.adapter.call('Security.handleCertificateError', request)
    }
    /** Enable/disable overriding certificate errors. If enabled, all certificate error events need to be handled by the DevTools client and should be answered with `handleCertificateError` commands. */
    public setOverrideCertificateErrors(request: Security.SetOverrideCertificateErrorsRequest): Promise<Security.SetOverrideCertificateErrorsResponse> {
      return this.adapter.call('Security.setOverrideCertificateErrors', request)
    }
    /** There is a certificate error. If overriding certificate errors is enabled, then it should be handled with the `handleCertificateError` command. Note: this event does not fire if the certificate error has been allowed internally. Only one client per target should override certificate errors at the same time. */
    public on(event: 'certificateError', handler: EventHandler<Security.CertificateErrorEvent>): EventListener
    /** The security state of the page changed. */
    public on(event: 'securityStateChanged', handler: EventHandler<Security.SecurityStateChangedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** There is a certificate error. If overriding certificate errors is enabled, then it should be handled with the `handleCertificateError` command. Note: this event does not fire if the certificate error has been allowed internally. Only one client per target should override certificate errors at the same time. */
    public once(event: 'certificateError', handler: EventHandler<Security.CertificateErrorEvent>): EventListener
    /** The security state of the page changed. */
    public once(event: 'securityStateChanged', handler: EventHandler<Security.SecurityStateChangedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class ServiceWorker {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('ServiceWorker.workerErrorReported', (event) => this.events.send('workerErrorReported', event))
      this.adapter.on('ServiceWorker.workerRegistrationUpdated', (event) => this.events.send('workerRegistrationUpdated', event))
      this.adapter.on('ServiceWorker.workerVersionUpdated', (event) => this.events.send('workerVersionUpdated', event))
    }

    public deliverPushMessage(request: ServiceWorker.DeliverPushMessageRequest): Promise<ServiceWorker.DeliverPushMessageResponse> {
      return this.adapter.call('ServiceWorker.deliverPushMessage', request)
    }

    public disable(request: ServiceWorker.DisableRequest): Promise<ServiceWorker.DisableResponse> {
      return this.adapter.call('ServiceWorker.disable', request)
    }

    public dispatchSyncEvent(request: ServiceWorker.DispatchSyncEventRequest): Promise<ServiceWorker.DispatchSyncEventResponse> {
      return this.adapter.call('ServiceWorker.dispatchSyncEvent', request)
    }

    public enable(request: ServiceWorker.EnableRequest): Promise<ServiceWorker.EnableResponse> {
      return this.adapter.call('ServiceWorker.enable', request)
    }

    public inspectWorker(request: ServiceWorker.InspectWorkerRequest): Promise<ServiceWorker.InspectWorkerResponse> {
      return this.adapter.call('ServiceWorker.inspectWorker', request)
    }

    public setForceUpdateOnPageLoad(request: ServiceWorker.SetForceUpdateOnPageLoadRequest): Promise<ServiceWorker.SetForceUpdateOnPageLoadResponse> {
      return this.adapter.call('ServiceWorker.setForceUpdateOnPageLoad', request)
    }

    public skipWaiting(request: ServiceWorker.SkipWaitingRequest): Promise<ServiceWorker.SkipWaitingResponse> {
      return this.adapter.call('ServiceWorker.skipWaiting', request)
    }

    public startWorker(request: ServiceWorker.StartWorkerRequest): Promise<ServiceWorker.StartWorkerResponse> {
      return this.adapter.call('ServiceWorker.startWorker', request)
    }

    public stopAllWorkers(request: ServiceWorker.StopAllWorkersRequest): Promise<ServiceWorker.StopAllWorkersResponse> {
      return this.adapter.call('ServiceWorker.stopAllWorkers', request)
    }

    public stopWorker(request: ServiceWorker.StopWorkerRequest): Promise<ServiceWorker.StopWorkerResponse> {
      return this.adapter.call('ServiceWorker.stopWorker', request)
    }

    public unregister(request: ServiceWorker.UnregisterRequest): Promise<ServiceWorker.UnregisterResponse> {
      return this.adapter.call('ServiceWorker.unregister', request)
    }

    public updateRegistration(request: ServiceWorker.UpdateRegistrationRequest): Promise<ServiceWorker.UpdateRegistrationResponse> {
      return this.adapter.call('ServiceWorker.updateRegistration', request)
    }

    public on(event: 'workerErrorReported', handler: EventHandler<ServiceWorker.WorkerErrorReportedEvent>): EventListener

    public on(event: 'workerRegistrationUpdated', handler: EventHandler<ServiceWorker.WorkerRegistrationUpdatedEvent>): EventListener

    public on(event: 'workerVersionUpdated', handler: EventHandler<ServiceWorker.WorkerVersionUpdatedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'workerErrorReported', handler: EventHandler<ServiceWorker.WorkerErrorReportedEvent>): EventListener

    public once(event: 'workerRegistrationUpdated', handler: EventHandler<ServiceWorker.WorkerRegistrationUpdatedEvent>): EventListener

    public once(event: 'workerVersionUpdated', handler: EventHandler<ServiceWorker.WorkerVersionUpdatedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Storage {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Storage.cacheStorageContentUpdated', (event) => this.events.send('cacheStorageContentUpdated', event))
      this.adapter.on('Storage.cacheStorageListUpdated', (event) => this.events.send('cacheStorageListUpdated', event))
      this.adapter.on('Storage.indexedDBContentUpdated', (event) => this.events.send('indexedDBContentUpdated', event))
      this.adapter.on('Storage.indexedDBListUpdated', (event) => this.events.send('indexedDBListUpdated', event))
    }
    /** Clears storage for origin. */
    public clearDataForOrigin(request: Storage.ClearDataForOriginRequest): Promise<Storage.ClearDataForOriginResponse> {
      return this.adapter.call('Storage.clearDataForOrigin', request)
    }
    /** Returns usage and quota in bytes. */
    public getUsageAndQuota(request: Storage.GetUsageAndQuotaRequest): Promise<Storage.GetUsageAndQuotaResponse> {
      return this.adapter.call('Storage.getUsageAndQuota', request)
    }
    /** Registers origin to be notified when an update occurs to its cache storage list. */
    public trackCacheStorageForOrigin(request: Storage.TrackCacheStorageForOriginRequest): Promise<Storage.TrackCacheStorageForOriginResponse> {
      return this.adapter.call('Storage.trackCacheStorageForOrigin', request)
    }
    /** Registers origin to be notified when an update occurs to its IndexedDB. */
    public trackIndexedDBForOrigin(request: Storage.TrackIndexedDBForOriginRequest): Promise<Storage.TrackIndexedDBForOriginResponse> {
      return this.adapter.call('Storage.trackIndexedDBForOrigin', request)
    }
    /** Unregisters origin from receiving notifications for cache storage. */
    public untrackCacheStorageForOrigin(request: Storage.UntrackCacheStorageForOriginRequest): Promise<Storage.UntrackCacheStorageForOriginResponse> {
      return this.adapter.call('Storage.untrackCacheStorageForOrigin', request)
    }
    /** Unregisters origin from receiving notifications for IndexedDB. */
    public untrackIndexedDBForOrigin(request: Storage.UntrackIndexedDBForOriginRequest): Promise<Storage.UntrackIndexedDBForOriginResponse> {
      return this.adapter.call('Storage.untrackIndexedDBForOrigin', request)
    }
    /** A cache's contents have been modified. */
    public on(event: 'cacheStorageContentUpdated', handler: EventHandler<Storage.CacheStorageContentUpdatedEvent>): EventListener
    /** A cache has been added/deleted. */
    public on(event: 'cacheStorageListUpdated', handler: EventHandler<Storage.CacheStorageListUpdatedEvent>): EventListener
    /** The origin's IndexedDB object store has been modified. */
    public on(event: 'indexedDBContentUpdated', handler: EventHandler<Storage.IndexedDBContentUpdatedEvent>): EventListener
    /** The origin's IndexedDB database list has been modified. */
    public on(event: 'indexedDBListUpdated', handler: EventHandler<Storage.IndexedDBListUpdatedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** A cache's contents have been modified. */
    public once(event: 'cacheStorageContentUpdated', handler: EventHandler<Storage.CacheStorageContentUpdatedEvent>): EventListener
    /** A cache has been added/deleted. */
    public once(event: 'cacheStorageListUpdated', handler: EventHandler<Storage.CacheStorageListUpdatedEvent>): EventListener
    /** The origin's IndexedDB object store has been modified. */
    public once(event: 'indexedDBContentUpdated', handler: EventHandler<Storage.IndexedDBContentUpdatedEvent>): EventListener
    /** The origin's IndexedDB database list has been modified. */
    public once(event: 'indexedDBListUpdated', handler: EventHandler<Storage.IndexedDBListUpdatedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class SystemInfo {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Returns information about the system. */
    public getInfo(request: SystemInfo.GetInfoRequest): Promise<SystemInfo.GetInfoResponse> {
      return this.adapter.call('SystemInfo.getInfo', request)
    }
    /** Returns information about all running processes. */
    public getProcessInfo(request: SystemInfo.GetProcessInfoRequest): Promise<SystemInfo.GetProcessInfoResponse> {
      return this.adapter.call('SystemInfo.getProcessInfo', request)
    }
  }
  export class Target {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Target.attachedToTarget', (event) => this.events.send('attachedToTarget', event))
      this.adapter.on('Target.detachedFromTarget', (event) => this.events.send('detachedFromTarget', event))
      this.adapter.on('Target.receivedMessageFromTarget', (event) => this.events.send('receivedMessageFromTarget', event))
      this.adapter.on('Target.targetCreated', (event) => this.events.send('targetCreated', event))
      this.adapter.on('Target.targetDestroyed', (event) => this.events.send('targetDestroyed', event))
      this.adapter.on('Target.targetCrashed', (event) => this.events.send('targetCrashed', event))
      this.adapter.on('Target.targetInfoChanged', (event) => this.events.send('targetInfoChanged', event))
    }
    /** Activates (focuses) the target. */
    public activateTarget(request: Target.ActivateTargetRequest): Promise<Target.ActivateTargetResponse> {
      return this.adapter.call('Target.activateTarget', request)
    }
    /** Attaches to the target with given id. */
    public attachToTarget(request: Target.AttachToTargetRequest): Promise<Target.AttachToTargetResponse> {
      return this.adapter.call('Target.attachToTarget', request)
    }
    /** Attaches to the browser target, only uses flat sessionId mode. */
    public attachToBrowserTarget(request: Target.AttachToBrowserTargetRequest): Promise<Target.AttachToBrowserTargetResponse> {
      return this.adapter.call('Target.attachToBrowserTarget', request)
    }
    /** Closes the target. If the target is a page that gets closed too. */
    public closeTarget(request: Target.CloseTargetRequest): Promise<Target.CloseTargetResponse> {
      return this.adapter.call('Target.closeTarget', request)
    }
    /** Inject object to the target's main frame that provides a communication channel with browser target.  Injected object will be available as `window[bindingName]`.  The object has the follwing API: - `binding.send(json)` - a method to send messages over the remote debugging protocol - `binding.onmessage = json => handleMessage(json)` - a callback that will be called for the protocol notifications and command responses. */
    public exposeDevToolsProtocol(request: Target.ExposeDevToolsProtocolRequest): Promise<Target.ExposeDevToolsProtocolResponse> {
      return this.adapter.call('Target.exposeDevToolsProtocol', request)
    }
    /** Creates a new empty BrowserContext. Similar to an incognito profile but you can have more than one. */
    public createBrowserContext(request: Target.CreateBrowserContextRequest): Promise<Target.CreateBrowserContextResponse> {
      return this.adapter.call('Target.createBrowserContext', request)
    }
    /** Returns all browser contexts created with `Target.createBrowserContext` method. */
    public getBrowserContexts(request: Target.GetBrowserContextsRequest): Promise<Target.GetBrowserContextsResponse> {
      return this.adapter.call('Target.getBrowserContexts', request)
    }
    /** Creates a new page. */
    public createTarget(request: Target.CreateTargetRequest): Promise<Target.CreateTargetResponse> {
      return this.adapter.call('Target.createTarget', request)
    }
    /** Detaches session with given id. */
    public detachFromTarget(request: Target.DetachFromTargetRequest): Promise<Target.DetachFromTargetResponse> {
      return this.adapter.call('Target.detachFromTarget', request)
    }
    /** Deletes a BrowserContext. All the belonging pages will be closed without calling their beforeunload hooks. */
    public disposeBrowserContext(request: Target.DisposeBrowserContextRequest): Promise<Target.DisposeBrowserContextResponse> {
      return this.adapter.call('Target.disposeBrowserContext', request)
    }
    /** Returns information about a target. */
    public getTargetInfo(request: Target.GetTargetInfoRequest): Promise<Target.GetTargetInfoResponse> {
      return this.adapter.call('Target.getTargetInfo', request)
    }
    /** Retrieves a list of available targets. */
    public getTargets(request: Target.GetTargetsRequest): Promise<Target.GetTargetsResponse> {
      return this.adapter.call('Target.getTargets', request)
    }
    /** Sends protocol message over session with given id. */
    public sendMessageToTarget(request: Target.SendMessageToTargetRequest): Promise<Target.SendMessageToTargetResponse> {
      return this.adapter.call('Target.sendMessageToTarget', request)
    }
    /** Controls whether to automatically attach to new targets which are considered to be related to this one. When turned on, attaches to all existing related targets as well. When turned off, automatically detaches from all currently attached targets. */
    public setAutoAttach(request: Target.SetAutoAttachRequest): Promise<Target.SetAutoAttachResponse> {
      return this.adapter.call('Target.setAutoAttach', request)
    }
    /** Controls whether to discover available targets and notify via `targetCreated/targetInfoChanged/targetDestroyed` events. */
    public setDiscoverTargets(request: Target.SetDiscoverTargetsRequest): Promise<Target.SetDiscoverTargetsResponse> {
      return this.adapter.call('Target.setDiscoverTargets', request)
    }
    /** Enables target discovery for the specified locations, when `setDiscoverTargets` was set to `true`. */
    public setRemoteLocations(request: Target.SetRemoteLocationsRequest): Promise<Target.SetRemoteLocationsResponse> {
      return this.adapter.call('Target.setRemoteLocations', request)
    }
    /** Issued when attached to target because of auto-attach or `attachToTarget` command. */
    public on(event: 'attachedToTarget', handler: EventHandler<Target.AttachedToTargetEvent>): EventListener
    /** Issued when detached from target for any reason (including `detachFromTarget` command). Can be issued multiple times per target if multiple sessions have been attached to it. */
    public on(event: 'detachedFromTarget', handler: EventHandler<Target.DetachedFromTargetEvent>): EventListener
    /** Notifies about a new protocol message received from the session (as reported in `attachedToTarget` event). */
    public on(event: 'receivedMessageFromTarget', handler: EventHandler<Target.ReceivedMessageFromTargetEvent>): EventListener
    /** Issued when a possible inspection target is created. */
    public on(event: 'targetCreated', handler: EventHandler<Target.TargetCreatedEvent>): EventListener
    /** Issued when a target is destroyed. */
    public on(event: 'targetDestroyed', handler: EventHandler<Target.TargetDestroyedEvent>): EventListener
    /** Issued when a target has crashed. */
    public on(event: 'targetCrashed', handler: EventHandler<Target.TargetCrashedEvent>): EventListener
    /** Issued when some information about a target has changed. This only happens between `targetCreated` and `targetDestroyed`. */
    public on(event: 'targetInfoChanged', handler: EventHandler<Target.TargetInfoChangedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Issued when attached to target because of auto-attach or `attachToTarget` command. */
    public once(event: 'attachedToTarget', handler: EventHandler<Target.AttachedToTargetEvent>): EventListener
    /** Issued when detached from target for any reason (including `detachFromTarget` command). Can be issued multiple times per target if multiple sessions have been attached to it. */
    public once(event: 'detachedFromTarget', handler: EventHandler<Target.DetachedFromTargetEvent>): EventListener
    /** Notifies about a new protocol message received from the session (as reported in `attachedToTarget` event). */
    public once(event: 'receivedMessageFromTarget', handler: EventHandler<Target.ReceivedMessageFromTargetEvent>): EventListener
    /** Issued when a possible inspection target is created. */
    public once(event: 'targetCreated', handler: EventHandler<Target.TargetCreatedEvent>): EventListener
    /** Issued when a target is destroyed. */
    public once(event: 'targetDestroyed', handler: EventHandler<Target.TargetDestroyedEvent>): EventListener
    /** Issued when a target has crashed. */
    public once(event: 'targetCrashed', handler: EventHandler<Target.TargetCrashedEvent>): EventListener
    /** Issued when some information about a target has changed. This only happens between `targetCreated` and `targetDestroyed`. */
    public once(event: 'targetInfoChanged', handler: EventHandler<Target.TargetInfoChangedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Tethering {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Tethering.accepted', (event) => this.events.send('accepted', event))
    }
    /** Request browser port binding. */
    public bind(request: Tethering.BindRequest): Promise<Tethering.BindResponse> {
      return this.adapter.call('Tethering.bind', request)
    }
    /** Request browser port unbinding. */
    public unbind(request: Tethering.UnbindRequest): Promise<Tethering.UnbindResponse> {
      return this.adapter.call('Tethering.unbind', request)
    }
    /** Informs that port was successfully bound and got a specified connection id. */
    public on(event: 'accepted', handler: EventHandler<Tethering.AcceptedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Informs that port was successfully bound and got a specified connection id. */
    public once(event: 'accepted', handler: EventHandler<Tethering.AcceptedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Tracing {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Tracing.bufferUsage', (event) => this.events.send('bufferUsage', event))
      this.adapter.on('Tracing.dataCollected', (event) => this.events.send('dataCollected', event))
      this.adapter.on('Tracing.tracingComplete', (event) => this.events.send('tracingComplete', event))
    }
    /** Stop trace events collection. */
    public end(request: Tracing.EndRequest): Promise<Tracing.EndResponse> {
      return this.adapter.call('Tracing.end', request)
    }
    /** Gets supported tracing categories. */
    public getCategories(request: Tracing.GetCategoriesRequest): Promise<Tracing.GetCategoriesResponse> {
      return this.adapter.call('Tracing.getCategories', request)
    }
    /** Record a clock sync marker in the trace. */
    public recordClockSyncMarker(request: Tracing.RecordClockSyncMarkerRequest): Promise<Tracing.RecordClockSyncMarkerResponse> {
      return this.adapter.call('Tracing.recordClockSyncMarker', request)
    }
    /** Request a global memory dump. */
    public requestMemoryDump(request: Tracing.RequestMemoryDumpRequest): Promise<Tracing.RequestMemoryDumpResponse> {
      return this.adapter.call('Tracing.requestMemoryDump', request)
    }
    /** Start trace events collection. */
    public start(request: Tracing.StartRequest): Promise<Tracing.StartResponse> {
      return this.adapter.call('Tracing.start', request)
    }

    public on(event: 'bufferUsage', handler: EventHandler<Tracing.BufferUsageEvent>): EventListener
    /** Contains an bucket of collected trace events. When tracing is stopped collected events will be send as a sequence of dataCollected events followed by tracingComplete event. */
    public on(event: 'dataCollected', handler: EventHandler<Tracing.DataCollectedEvent>): EventListener
    /** Signals that tracing is stopped and there is no trace buffers pending flush, all data were delivered via dataCollected events. */
    public on(event: 'tracingComplete', handler: EventHandler<Tracing.TracingCompleteEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'bufferUsage', handler: EventHandler<Tracing.BufferUsageEvent>): EventListener
    /** Contains an bucket of collected trace events. When tracing is stopped collected events will be send as a sequence of dataCollected events followed by tracingComplete event. */
    public once(event: 'dataCollected', handler: EventHandler<Tracing.DataCollectedEvent>): EventListener
    /** Signals that tracing is stopped and there is no trace buffers pending flush, all data were delivered via dataCollected events. */
    public once(event: 'tracingComplete', handler: EventHandler<Tracing.TracingCompleteEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Fetch {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Fetch.requestPaused', (event) => this.events.send('requestPaused', event))
      this.adapter.on('Fetch.authRequired', (event) => this.events.send('authRequired', event))
    }
    /** Disables the fetch domain. */
    public disable(request: Fetch.DisableRequest): Promise<Fetch.DisableResponse> {
      return this.adapter.call('Fetch.disable', request)
    }
    /** Enables issuing of requestPaused events. A request will be paused until client calls one of failRequest, fulfillRequest or continueRequest/continueWithAuth. */
    public enable(request: Fetch.EnableRequest): Promise<Fetch.EnableResponse> {
      return this.adapter.call('Fetch.enable', request)
    }
    /** Causes the request to fail with specified reason. */
    public failRequest(request: Fetch.FailRequestRequest): Promise<Fetch.FailRequestResponse> {
      return this.adapter.call('Fetch.failRequest', request)
    }
    /** Provides response to the request. */
    public fulfillRequest(request: Fetch.FulfillRequestRequest): Promise<Fetch.FulfillRequestResponse> {
      return this.adapter.call('Fetch.fulfillRequest', request)
    }
    /** Continues the request, optionally modifying some of its parameters. */
    public continueRequest(request: Fetch.ContinueRequestRequest): Promise<Fetch.ContinueRequestResponse> {
      return this.adapter.call('Fetch.continueRequest', request)
    }
    /** Continues a request supplying authChallengeResponse following authRequired event. */
    public continueWithAuth(request: Fetch.ContinueWithAuthRequest): Promise<Fetch.ContinueWithAuthResponse> {
      return this.adapter.call('Fetch.continueWithAuth', request)
    }
    /** Causes the body of the response to be received from the server and returned as a single string. May only be issued for a request that is paused in the Response stage and is mutually exclusive with takeResponseBodyForInterceptionAsStream. Calling other methods that affect the request or disabling fetch domain before body is received results in an undefined behavior. */
    public getResponseBody(request: Fetch.GetResponseBodyRequest): Promise<Fetch.GetResponseBodyResponse> {
      return this.adapter.call('Fetch.getResponseBody', request)
    }
    /** Returns a handle to the stream representing the response body. The request must be paused in the HeadersReceived stage. Note that after this command the request can't be continued as is -- client either needs to cancel it or to provide the response body. The stream only supports sequential read, IO.read will fail if the position is specified. This method is mutually exclusive with getResponseBody. Calling other methods that affect the request or disabling fetch domain before body is received results in an undefined behavior. */
    public takeResponseBodyAsStream(request: Fetch.TakeResponseBodyAsStreamRequest): Promise<Fetch.TakeResponseBodyAsStreamResponse> {
      return this.adapter.call('Fetch.takeResponseBodyAsStream', request)
    }
    /** Issued when the domain is enabled and the request URL matches the specified filter. The request is paused until the client responds with one of continueRequest, failRequest or fulfillRequest. The stage of the request can be determined by presence of responseErrorReason and responseStatusCode -- the request is at the response stage if either of these fields is present and in the request stage otherwise. */
    public on(event: 'requestPaused', handler: EventHandler<Fetch.RequestPausedEvent>): EventListener
    /** Issued when the domain is enabled with handleAuthRequests set to true. The request is paused until client responds with continueWithAuth. */
    public on(event: 'authRequired', handler: EventHandler<Fetch.AuthRequiredEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Issued when the domain is enabled and the request URL matches the specified filter. The request is paused until the client responds with one of continueRequest, failRequest or fulfillRequest. The stage of the request can be determined by presence of responseErrorReason and responseStatusCode -- the request is at the response stage if either of these fields is present and in the request stage otherwise. */
    public once(event: 'requestPaused', handler: EventHandler<Fetch.RequestPausedEvent>): EventListener
    /** Issued when the domain is enabled with handleAuthRequests set to true. The request is paused until client responds with continueWithAuth. */
    public once(event: 'authRequired', handler: EventHandler<Fetch.AuthRequiredEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class WebAudio {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('WebAudio.contextCreated', (event) => this.events.send('contextCreated', event))
      this.adapter.on('WebAudio.contextDestroyed', (event) => this.events.send('contextDestroyed', event))
      this.adapter.on('WebAudio.contextChanged', (event) => this.events.send('contextChanged', event))
    }
    /** Enables the WebAudio domain and starts sending context lifetime events. */
    public enable(request: WebAudio.EnableRequest): Promise<WebAudio.EnableResponse> {
      return this.adapter.call('WebAudio.enable', request)
    }
    /** Disables the WebAudio domain. */
    public disable(request: WebAudio.DisableRequest): Promise<WebAudio.DisableResponse> {
      return this.adapter.call('WebAudio.disable', request)
    }
    /** Fetch the realtime data from the registered contexts. */
    public getRealtimeData(request: WebAudio.GetRealtimeDataRequest): Promise<WebAudio.GetRealtimeDataResponse> {
      return this.adapter.call('WebAudio.getRealtimeData', request)
    }
    /** Notifies that a new BaseAudioContext has been created. */
    public on(event: 'contextCreated', handler: EventHandler<WebAudio.ContextCreatedEvent>): EventListener
    /** Notifies that existing BaseAudioContext has been destroyed. */
    public on(event: 'contextDestroyed', handler: EventHandler<WebAudio.ContextDestroyedEvent>): EventListener
    /** Notifies that existing BaseAudioContext has changed some properties (id stays the same).. */
    public on(event: 'contextChanged', handler: EventHandler<WebAudio.ContextChangedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Notifies that a new BaseAudioContext has been created. */
    public once(event: 'contextCreated', handler: EventHandler<WebAudio.ContextCreatedEvent>): EventListener
    /** Notifies that existing BaseAudioContext has been destroyed. */
    public once(event: 'contextDestroyed', handler: EventHandler<WebAudio.ContextDestroyedEvent>): EventListener
    /** Notifies that existing BaseAudioContext has changed some properties (id stays the same).. */
    public once(event: 'contextChanged', handler: EventHandler<WebAudio.ContextChangedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class WebAuthn {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Enable the WebAuthn domain and start intercepting credential storage and retrieval with a virtual authenticator. */
    public enable(request: WebAuthn.EnableRequest): Promise<WebAuthn.EnableResponse> {
      return this.adapter.call('WebAuthn.enable', request)
    }
    /** Disable the WebAuthn domain. */
    public disable(request: WebAuthn.DisableRequest): Promise<WebAuthn.DisableResponse> {
      return this.adapter.call('WebAuthn.disable', request)
    }
    /** Creates and adds a virtual authenticator. */
    public addVirtualAuthenticator(request: WebAuthn.AddVirtualAuthenticatorRequest): Promise<WebAuthn.AddVirtualAuthenticatorResponse> {
      return this.adapter.call('WebAuthn.addVirtualAuthenticator', request)
    }
    /** Removes the given authenticator. */
    public removeVirtualAuthenticator(request: WebAuthn.RemoveVirtualAuthenticatorRequest): Promise<WebAuthn.RemoveVirtualAuthenticatorResponse> {
      return this.adapter.call('WebAuthn.removeVirtualAuthenticator', request)
    }
    /** Adds the credential to the specified authenticator. */
    public addCredential(request: WebAuthn.AddCredentialRequest): Promise<WebAuthn.AddCredentialResponse> {
      return this.adapter.call('WebAuthn.addCredential', request)
    }
    /** Returns all the credentials stored in the given virtual authenticator. */
    public getCredentials(request: WebAuthn.GetCredentialsRequest): Promise<WebAuthn.GetCredentialsResponse> {
      return this.adapter.call('WebAuthn.getCredentials', request)
    }
    /** Clears all the credentials from the specified device. */
    public clearCredentials(request: WebAuthn.ClearCredentialsRequest): Promise<WebAuthn.ClearCredentialsResponse> {
      return this.adapter.call('WebAuthn.clearCredentials', request)
    }
    /** Sets whether User Verification succeeds or fails for an authenticator. The default is true. */
    public setUserVerified(request: WebAuthn.SetUserVerifiedRequest): Promise<WebAuthn.SetUserVerifiedResponse> {
      return this.adapter.call('WebAuthn.setUserVerified', request)
    }
  }
  export class Console {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Console.messageAdded', (event) => this.events.send('messageAdded', event))
    }
    /** Does nothing. */
    public clearMessages(request: Console.ClearMessagesRequest): Promise<Console.ClearMessagesResponse> {
      return this.adapter.call('Console.clearMessages', request)
    }
    /** Disables console domain, prevents further console messages from being reported to the client. */
    public disable(request: Console.DisableRequest): Promise<Console.DisableResponse> {
      return this.adapter.call('Console.disable', request)
    }
    /** Enables console domain, sends the messages collected so far to the client by means of the `messageAdded` notification. */
    public enable(request: Console.EnableRequest): Promise<Console.EnableResponse> {
      return this.adapter.call('Console.enable', request)
    }
    /** Issued when new console message is added. */
    public on(event: 'messageAdded', handler: EventHandler<Console.MessageAddedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Issued when new console message is added. */
    public once(event: 'messageAdded', handler: EventHandler<Console.MessageAddedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Debugger {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Debugger.breakpointResolved', (event) => this.events.send('breakpointResolved', event))
      this.adapter.on('Debugger.paused', (event) => this.events.send('paused', event))
      this.adapter.on('Debugger.resumed', (event) => this.events.send('resumed', event))
      this.adapter.on('Debugger.scriptFailedToParse', (event) => this.events.send('scriptFailedToParse', event))
      this.adapter.on('Debugger.scriptParsed', (event) => this.events.send('scriptParsed', event))
    }
    /** Continues execution until specific location is reached. */
    public continueToLocation(request: Debugger.ContinueToLocationRequest): Promise<Debugger.ContinueToLocationResponse> {
      return this.adapter.call('Debugger.continueToLocation', request)
    }
    /** Disables debugger for given page. */
    public disable(request: Debugger.DisableRequest): Promise<Debugger.DisableResponse> {
      return this.adapter.call('Debugger.disable', request)
    }
    /** Enables debugger for the given page. Clients should not assume that the debugging has been enabled until the result for this command is received. */
    public enable(request: Debugger.EnableRequest): Promise<Debugger.EnableResponse> {
      return this.adapter.call('Debugger.enable', request)
    }
    /** Evaluates expression on a given call frame. */
    public evaluateOnCallFrame(request: Debugger.EvaluateOnCallFrameRequest): Promise<Debugger.EvaluateOnCallFrameResponse> {
      return this.adapter.call('Debugger.evaluateOnCallFrame', request)
    }
    /** Returns possible locations for breakpoint. scriptId in start and end range locations should be the same. */
    public getPossibleBreakpoints(request: Debugger.GetPossibleBreakpointsRequest): Promise<Debugger.GetPossibleBreakpointsResponse> {
      return this.adapter.call('Debugger.getPossibleBreakpoints', request)
    }
    /** Returns source for the script with given id. */
    public getScriptSource(request: Debugger.GetScriptSourceRequest): Promise<Debugger.GetScriptSourceResponse> {
      return this.adapter.call('Debugger.getScriptSource', request)
    }
    /** Returns stack trace with given `stackTraceId`. */
    public getStackTrace(request: Debugger.GetStackTraceRequest): Promise<Debugger.GetStackTraceResponse> {
      return this.adapter.call('Debugger.getStackTrace', request)
    }
    /** Stops on the next JavaScript statement. */
    public pause(request: Debugger.PauseRequest): Promise<Debugger.PauseResponse> {
      return this.adapter.call('Debugger.pause', request)
    }

    public pauseOnAsyncCall(request: Debugger.PauseOnAsyncCallRequest): Promise<Debugger.PauseOnAsyncCallResponse> {
      return this.adapter.call('Debugger.pauseOnAsyncCall', request)
    }
    /** Removes JavaScript breakpoint. */
    public removeBreakpoint(request: Debugger.RemoveBreakpointRequest): Promise<Debugger.RemoveBreakpointResponse> {
      return this.adapter.call('Debugger.removeBreakpoint', request)
    }
    /** Restarts particular call frame from the beginning. */
    public restartFrame(request: Debugger.RestartFrameRequest): Promise<Debugger.RestartFrameResponse> {
      return this.adapter.call('Debugger.restartFrame', request)
    }
    /** Resumes JavaScript execution. */
    public resume(request: Debugger.ResumeRequest): Promise<Debugger.ResumeResponse> {
      return this.adapter.call('Debugger.resume', request)
    }
    /** Searches for given string in script content. */
    public searchInContent(request: Debugger.SearchInContentRequest): Promise<Debugger.SearchInContentResponse> {
      return this.adapter.call('Debugger.searchInContent', request)
    }
    /** Enables or disables async call stacks tracking. */
    public setAsyncCallStackDepth(request: Debugger.SetAsyncCallStackDepthRequest): Promise<Debugger.SetAsyncCallStackDepthResponse> {
      return this.adapter.call('Debugger.setAsyncCallStackDepth', request)
    }
    /** Replace previous blackbox patterns with passed ones. Forces backend to skip stepping/pausing in scripts with url matching one of the patterns. VM will try to leave blackboxed script by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. */
    public setBlackboxPatterns(request: Debugger.SetBlackboxPatternsRequest): Promise<Debugger.SetBlackboxPatternsResponse> {
      return this.adapter.call('Debugger.setBlackboxPatterns', request)
    }
    /** Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. Positions array contains positions where blackbox state is changed. First interval isn't blackboxed. Array should be sorted. */
    public setBlackboxedRanges(request: Debugger.SetBlackboxedRangesRequest): Promise<Debugger.SetBlackboxedRangesResponse> {
      return this.adapter.call('Debugger.setBlackboxedRanges', request)
    }
    /** Sets JavaScript breakpoint at a given location. */
    public setBreakpoint(request: Debugger.SetBreakpointRequest): Promise<Debugger.SetBreakpointResponse> {
      return this.adapter.call('Debugger.setBreakpoint', request)
    }
    /** Sets instrumentation breakpoint. */
    public setInstrumentationBreakpoint(request: Debugger.SetInstrumentationBreakpointRequest): Promise<Debugger.SetInstrumentationBreakpointResponse> {
      return this.adapter.call('Debugger.setInstrumentationBreakpoint', request)
    }
    /** Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in `locations` property. Further matching script parsing will result in subsequent `breakpointResolved` events issued. This logical breakpoint will survive page reloads. */
    public setBreakpointByUrl(request: Debugger.SetBreakpointByUrlRequest): Promise<Debugger.SetBreakpointByUrlResponse> {
      return this.adapter.call('Debugger.setBreakpointByUrl', request)
    }
    /** Sets JavaScript breakpoint before each call to the given function. If another function was created from the same source as a given one, calling it will also trigger the breakpoint. */
    public setBreakpointOnFunctionCall(request: Debugger.SetBreakpointOnFunctionCallRequest): Promise<Debugger.SetBreakpointOnFunctionCallResponse> {
      return this.adapter.call('Debugger.setBreakpointOnFunctionCall', request)
    }
    /** Activates / deactivates all breakpoints on the page. */
    public setBreakpointsActive(request: Debugger.SetBreakpointsActiveRequest): Promise<Debugger.SetBreakpointsActiveResponse> {
      return this.adapter.call('Debugger.setBreakpointsActive', request)
    }
    /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is `none`. */
    public setPauseOnExceptions(request: Debugger.SetPauseOnExceptionsRequest): Promise<Debugger.SetPauseOnExceptionsResponse> {
      return this.adapter.call('Debugger.setPauseOnExceptions', request)
    }
    /** Changes return value in top frame. Available only at return break position. */
    public setReturnValue(request: Debugger.SetReturnValueRequest): Promise<Debugger.SetReturnValueResponse> {
      return this.adapter.call('Debugger.setReturnValue', request)
    }
    /** Edits JavaScript source live. */
    public setScriptSource(request: Debugger.SetScriptSourceRequest): Promise<Debugger.SetScriptSourceResponse> {
      return this.adapter.call('Debugger.setScriptSource', request)
    }
    /** Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc). */
    public setSkipAllPauses(request: Debugger.SetSkipAllPausesRequest): Promise<Debugger.SetSkipAllPausesResponse> {
      return this.adapter.call('Debugger.setSkipAllPauses', request)
    }
    /** Changes value of variable in a callframe. Object-based scopes are not supported and must be mutated manually. */
    public setVariableValue(request: Debugger.SetVariableValueRequest): Promise<Debugger.SetVariableValueResponse> {
      return this.adapter.call('Debugger.setVariableValue', request)
    }
    /** Steps into the function call. */
    public stepInto(request: Debugger.StepIntoRequest): Promise<Debugger.StepIntoResponse> {
      return this.adapter.call('Debugger.stepInto', request)
    }
    /** Steps out of the function call. */
    public stepOut(request: Debugger.StepOutRequest): Promise<Debugger.StepOutResponse> {
      return this.adapter.call('Debugger.stepOut', request)
    }
    /** Steps over the statement. */
    public stepOver(request: Debugger.StepOverRequest): Promise<Debugger.StepOverResponse> {
      return this.adapter.call('Debugger.stepOver', request)
    }
    /** Fired when breakpoint is resolved to an actual script and location. */
    public on(event: 'breakpointResolved', handler: EventHandler<Debugger.BreakpointResolvedEvent>): EventListener
    /** Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria. */
    public on(event: 'paused', handler: EventHandler<Debugger.PausedEvent>): EventListener
    /** Fired when the virtual machine resumed execution. */
    public on(event: 'resumed', handler: EventHandler<Debugger.ResumedEvent>): EventListener
    /** Fired when virtual machine fails to parse the script. */
    public on(event: 'scriptFailedToParse', handler: EventHandler<Debugger.ScriptFailedToParseEvent>): EventListener
    /** Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger. */
    public on(event: 'scriptParsed', handler: EventHandler<Debugger.ScriptParsedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Fired when breakpoint is resolved to an actual script and location. */
    public once(event: 'breakpointResolved', handler: EventHandler<Debugger.BreakpointResolvedEvent>): EventListener
    /** Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria. */
    public once(event: 'paused', handler: EventHandler<Debugger.PausedEvent>): EventListener
    /** Fired when the virtual machine resumed execution. */
    public once(event: 'resumed', handler: EventHandler<Debugger.ResumedEvent>): EventListener
    /** Fired when virtual machine fails to parse the script. */
    public once(event: 'scriptFailedToParse', handler: EventHandler<Debugger.ScriptFailedToParseEvent>): EventListener
    /** Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger. */
    public once(event: 'scriptParsed', handler: EventHandler<Debugger.ScriptParsedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class HeapProfiler {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('HeapProfiler.addHeapSnapshotChunk', (event) => this.events.send('addHeapSnapshotChunk', event))
      this.adapter.on('HeapProfiler.heapStatsUpdate', (event) => this.events.send('heapStatsUpdate', event))
      this.adapter.on('HeapProfiler.lastSeenObjectId', (event) => this.events.send('lastSeenObjectId', event))
      this.adapter.on('HeapProfiler.reportHeapSnapshotProgress', (event) => this.events.send('reportHeapSnapshotProgress', event))
      this.adapter.on('HeapProfiler.resetProfiles', (event) => this.events.send('resetProfiles', event))
    }
    /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
    public addInspectedHeapObject(request: HeapProfiler.AddInspectedHeapObjectRequest): Promise<HeapProfiler.AddInspectedHeapObjectResponse> {
      return this.adapter.call('HeapProfiler.addInspectedHeapObject', request)
    }

    public collectGarbage(request: HeapProfiler.CollectGarbageRequest): Promise<HeapProfiler.CollectGarbageResponse> {
      return this.adapter.call('HeapProfiler.collectGarbage', request)
    }

    public disable(request: HeapProfiler.DisableRequest): Promise<HeapProfiler.DisableResponse> {
      return this.adapter.call('HeapProfiler.disable', request)
    }

    public enable(request: HeapProfiler.EnableRequest): Promise<HeapProfiler.EnableResponse> {
      return this.adapter.call('HeapProfiler.enable', request)
    }

    public getHeapObjectId(request: HeapProfiler.GetHeapObjectIdRequest): Promise<HeapProfiler.GetHeapObjectIdResponse> {
      return this.adapter.call('HeapProfiler.getHeapObjectId', request)
    }

    public getObjectByHeapObjectId(request: HeapProfiler.GetObjectByHeapObjectIdRequest): Promise<HeapProfiler.GetObjectByHeapObjectIdResponse> {
      return this.adapter.call('HeapProfiler.getObjectByHeapObjectId', request)
    }

    public getSamplingProfile(request: HeapProfiler.GetSamplingProfileRequest): Promise<HeapProfiler.GetSamplingProfileResponse> {
      return this.adapter.call('HeapProfiler.getSamplingProfile', request)
    }

    public startSampling(request: HeapProfiler.StartSamplingRequest): Promise<HeapProfiler.StartSamplingResponse> {
      return this.adapter.call('HeapProfiler.startSampling', request)
    }

    public startTrackingHeapObjects(request: HeapProfiler.StartTrackingHeapObjectsRequest): Promise<HeapProfiler.StartTrackingHeapObjectsResponse> {
      return this.adapter.call('HeapProfiler.startTrackingHeapObjects', request)
    }

    public stopSampling(request: HeapProfiler.StopSamplingRequest): Promise<HeapProfiler.StopSamplingResponse> {
      return this.adapter.call('HeapProfiler.stopSampling', request)
    }

    public stopTrackingHeapObjects(request: HeapProfiler.StopTrackingHeapObjectsRequest): Promise<HeapProfiler.StopTrackingHeapObjectsResponse> {
      return this.adapter.call('HeapProfiler.stopTrackingHeapObjects', request)
    }

    public takeHeapSnapshot(request: HeapProfiler.TakeHeapSnapshotRequest): Promise<HeapProfiler.TakeHeapSnapshotResponse> {
      return this.adapter.call('HeapProfiler.takeHeapSnapshot', request)
    }

    public on(event: 'addHeapSnapshotChunk', handler: EventHandler<HeapProfiler.AddHeapSnapshotChunkEvent>): EventListener
    /** If heap objects tracking has been started then backend may send update for one or more fragments */
    public on(event: 'heapStatsUpdate', handler: EventHandler<HeapProfiler.HeapStatsUpdateEvent>): EventListener
    /** If heap objects tracking has been started then backend regularly sends a current value for last seen object id and corresponding timestamp. If the were changes in the heap since last event then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event. */
    public on(event: 'lastSeenObjectId', handler: EventHandler<HeapProfiler.LastSeenObjectIdEvent>): EventListener

    public on(event: 'reportHeapSnapshotProgress', handler: EventHandler<HeapProfiler.ReportHeapSnapshotProgressEvent>): EventListener

    public on(event: 'resetProfiles', handler: EventHandler<HeapProfiler.ResetProfilesEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'addHeapSnapshotChunk', handler: EventHandler<HeapProfiler.AddHeapSnapshotChunkEvent>): EventListener
    /** If heap objects tracking has been started then backend may send update for one or more fragments */
    public once(event: 'heapStatsUpdate', handler: EventHandler<HeapProfiler.HeapStatsUpdateEvent>): EventListener
    /** If heap objects tracking has been started then backend regularly sends a current value for last seen object id and corresponding timestamp. If the were changes in the heap since last event then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event. */
    public once(event: 'lastSeenObjectId', handler: EventHandler<HeapProfiler.LastSeenObjectIdEvent>): EventListener

    public once(event: 'reportHeapSnapshotProgress', handler: EventHandler<HeapProfiler.ReportHeapSnapshotProgressEvent>): EventListener

    public once(event: 'resetProfiles', handler: EventHandler<HeapProfiler.ResetProfilesEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Profiler {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Profiler.consoleProfileFinished', (event) => this.events.send('consoleProfileFinished', event))
      this.adapter.on('Profiler.consoleProfileStarted', (event) => this.events.send('consoleProfileStarted', event))
    }

    public disable(request: Profiler.DisableRequest): Promise<Profiler.DisableResponse> {
      return this.adapter.call('Profiler.disable', request)
    }

    public enable(request: Profiler.EnableRequest): Promise<Profiler.EnableResponse> {
      return this.adapter.call('Profiler.enable', request)
    }
    /** Collect coverage data for the current isolate. The coverage data may be incomplete due to garbage collection. */
    public getBestEffortCoverage(request: Profiler.GetBestEffortCoverageRequest): Promise<Profiler.GetBestEffortCoverageResponse> {
      return this.adapter.call('Profiler.getBestEffortCoverage', request)
    }
    /** Changes CPU profiler sampling interval. Must be called before CPU profiles recording started. */
    public setSamplingInterval(request: Profiler.SetSamplingIntervalRequest): Promise<Profiler.SetSamplingIntervalResponse> {
      return this.adapter.call('Profiler.setSamplingInterval', request)
    }

    public start(request: Profiler.StartRequest): Promise<Profiler.StartResponse> {
      return this.adapter.call('Profiler.start', request)
    }
    /** Enable precise code coverage. Coverage data for JavaScript executed before enabling precise code coverage may be incomplete. Enabling prevents running optimized code and resets execution counters. */
    public startPreciseCoverage(request: Profiler.StartPreciseCoverageRequest): Promise<Profiler.StartPreciseCoverageResponse> {
      return this.adapter.call('Profiler.startPreciseCoverage', request)
    }
    /** Enable type profile. */
    public startTypeProfile(request: Profiler.StartTypeProfileRequest): Promise<Profiler.StartTypeProfileResponse> {
      return this.adapter.call('Profiler.startTypeProfile', request)
    }

    public stop(request: Profiler.StopRequest): Promise<Profiler.StopResponse> {
      return this.adapter.call('Profiler.stop', request)
    }
    /** Disable precise code coverage. Disabling releases unnecessary execution count records and allows executing optimized code. */
    public stopPreciseCoverage(request: Profiler.StopPreciseCoverageRequest): Promise<Profiler.StopPreciseCoverageResponse> {
      return this.adapter.call('Profiler.stopPreciseCoverage', request)
    }
    /** Disable type profile. Disabling releases type profile data collected so far. */
    public stopTypeProfile(request: Profiler.StopTypeProfileRequest): Promise<Profiler.StopTypeProfileResponse> {
      return this.adapter.call('Profiler.stopTypeProfile', request)
    }
    /** Collect coverage data for the current isolate, and resets execution counters. Precise code coverage needs to have started. */
    public takePreciseCoverage(request: Profiler.TakePreciseCoverageRequest): Promise<Profiler.TakePreciseCoverageResponse> {
      return this.adapter.call('Profiler.takePreciseCoverage', request)
    }
    /** Collect type profile. */
    public takeTypeProfile(request: Profiler.TakeTypeProfileRequest): Promise<Profiler.TakeTypeProfileResponse> {
      return this.adapter.call('Profiler.takeTypeProfile', request)
    }

    public on(event: 'consoleProfileFinished', handler: EventHandler<Profiler.ConsoleProfileFinishedEvent>): EventListener
    /** Sent when new profile recording is started using console.profile() call. */
    public on(event: 'consoleProfileStarted', handler: EventHandler<Profiler.ConsoleProfileStartedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }

    public once(event: 'consoleProfileFinished', handler: EventHandler<Profiler.ConsoleProfileFinishedEvent>): EventListener
    /** Sent when new profile recording is started using console.profile() call. */
    public once(event: 'consoleProfileStarted', handler: EventHandler<Profiler.ConsoleProfileStartedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Runtime {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
      this.adapter.on('Runtime.bindingCalled', (event) => this.events.send('bindingCalled', event))
      this.adapter.on('Runtime.consoleAPICalled', (event) => this.events.send('consoleAPICalled', event))
      this.adapter.on('Runtime.exceptionRevoked', (event) => this.events.send('exceptionRevoked', event))
      this.adapter.on('Runtime.exceptionThrown', (event) => this.events.send('exceptionThrown', event))
      this.adapter.on('Runtime.executionContextCreated', (event) => this.events.send('executionContextCreated', event))
      this.adapter.on('Runtime.executionContextDestroyed', (event) => this.events.send('executionContextDestroyed', event))
      this.adapter.on('Runtime.executionContextsCleared', (event) => this.events.send('executionContextsCleared', event))
      this.adapter.on('Runtime.inspectRequested', (event) => this.events.send('inspectRequested', event))
    }
    /** Add handler to promise with given promise object id. */
    public awaitPromise(request: Runtime.AwaitPromiseRequest): Promise<Runtime.AwaitPromiseResponse> {
      return this.adapter.call('Runtime.awaitPromise', request)
    }
    /** Calls function with given declaration on the given object. Object group of the result is inherited from the target object. */
    public callFunctionOn(request: Runtime.CallFunctionOnRequest): Promise<Runtime.CallFunctionOnResponse> {
      return this.adapter.call('Runtime.callFunctionOn', request)
    }
    /** Compiles expression. */
    public compileScript(request: Runtime.CompileScriptRequest): Promise<Runtime.CompileScriptResponse> {
      return this.adapter.call('Runtime.compileScript', request)
    }
    /** Disables reporting of execution contexts creation. */
    public disable(request: Runtime.DisableRequest): Promise<Runtime.DisableResponse> {
      return this.adapter.call('Runtime.disable', request)
    }
    /** Discards collected exceptions and console API calls. */
    public discardConsoleEntries(request: Runtime.DiscardConsoleEntriesRequest): Promise<Runtime.DiscardConsoleEntriesResponse> {
      return this.adapter.call('Runtime.discardConsoleEntries', request)
    }
    /** Enables reporting of execution contexts creation by means of `executionContextCreated` event. When the reporting gets enabled the event will be sent immediately for each existing execution context. */
    public enable(request: Runtime.EnableRequest): Promise<Runtime.EnableResponse> {
      return this.adapter.call('Runtime.enable', request)
    }
    /** Evaluates expression on global object. */
    public evaluate(request: Runtime.EvaluateRequest): Promise<Runtime.EvaluateResponse> {
      return this.adapter.call('Runtime.evaluate', request)
    }
    /** Returns the isolate id. */
    public getIsolateId(request: Runtime.GetIsolateIdRequest): Promise<Runtime.GetIsolateIdResponse> {
      return this.adapter.call('Runtime.getIsolateId', request)
    }
    /** Returns the JavaScript heap usage. It is the total usage of the corresponding isolate not scoped to a particular Runtime. */
    public getHeapUsage(request: Runtime.GetHeapUsageRequest): Promise<Runtime.GetHeapUsageResponse> {
      return this.adapter.call('Runtime.getHeapUsage', request)
    }
    /** Returns properties of a given object. Object group of the result is inherited from the target object. */
    public getProperties(request: Runtime.GetPropertiesRequest): Promise<Runtime.GetPropertiesResponse> {
      return this.adapter.call('Runtime.getProperties', request)
    }
    /** Returns all let, const and class variables from global scope. */
    public globalLexicalScopeNames(request: Runtime.GlobalLexicalScopeNamesRequest): Promise<Runtime.GlobalLexicalScopeNamesResponse> {
      return this.adapter.call('Runtime.globalLexicalScopeNames', request)
    }

    public queryObjects(request: Runtime.QueryObjectsRequest): Promise<Runtime.QueryObjectsResponse> {
      return this.adapter.call('Runtime.queryObjects', request)
    }
    /** Releases remote object with given id. */
    public releaseObject(request: Runtime.ReleaseObjectRequest): Promise<Runtime.ReleaseObjectResponse> {
      return this.adapter.call('Runtime.releaseObject', request)
    }
    /** Releases all remote objects that belong to a given group. */
    public releaseObjectGroup(request: Runtime.ReleaseObjectGroupRequest): Promise<Runtime.ReleaseObjectGroupResponse> {
      return this.adapter.call('Runtime.releaseObjectGroup', request)
    }
    /** Tells inspected instance to run if it was waiting for debugger to attach. */
    public runIfWaitingForDebugger(request: Runtime.RunIfWaitingForDebuggerRequest): Promise<Runtime.RunIfWaitingForDebuggerResponse> {
      return this.adapter.call('Runtime.runIfWaitingForDebugger', request)
    }
    /** Runs script with given id in a given context. */
    public runScript(request: Runtime.RunScriptRequest): Promise<Runtime.RunScriptResponse> {
      return this.adapter.call('Runtime.runScript', request)
    }
    /** Enables or disables async call stacks tracking. */
    public setAsyncCallStackDepth(request: Runtime.SetAsyncCallStackDepthRequest): Promise<Runtime.SetAsyncCallStackDepthResponse> {
      return this.adapter.call('Runtime.setAsyncCallStackDepth', request)
    }

    public setCustomObjectFormatterEnabled(request: Runtime.SetCustomObjectFormatterEnabledRequest): Promise<Runtime.SetCustomObjectFormatterEnabledResponse> {
      return this.adapter.call('Runtime.setCustomObjectFormatterEnabled', request)
    }

    public setMaxCallStackSizeToCapture(request: Runtime.SetMaxCallStackSizeToCaptureRequest): Promise<Runtime.SetMaxCallStackSizeToCaptureResponse> {
      return this.adapter.call('Runtime.setMaxCallStackSizeToCapture', request)
    }
    /** Terminate current or next JavaScript execution. Will cancel the termination when the outer-most script execution ends. */
    public terminateExecution(request: Runtime.TerminateExecutionRequest): Promise<Runtime.TerminateExecutionResponse> {
      return this.adapter.call('Runtime.terminateExecution', request)
    }
    /** If executionContextId is empty, adds binding with the given name on the global objects of all inspected contexts, including those created later, bindings survive reloads. If executionContextId is specified, adds binding only on global object of given execution context. Binding function takes exactly one argument, this argument should be string, in case of any other input, function throws an exception. Each binding function call produces Runtime.bindingCalled notification. */
    public addBinding(request: Runtime.AddBindingRequest): Promise<Runtime.AddBindingResponse> {
      return this.adapter.call('Runtime.addBinding', request)
    }
    /** This method does not remove binding function from global object but unsubscribes current runtime agent from Runtime.bindingCalled notifications. */
    public removeBinding(request: Runtime.RemoveBindingRequest): Promise<Runtime.RemoveBindingResponse> {
      return this.adapter.call('Runtime.removeBinding', request)
    }
    /** Notification is issued every time when binding is called. */
    public on(event: 'bindingCalled', handler: EventHandler<Runtime.BindingCalledEvent>): EventListener
    /** Issued when console API was called. */
    public on(event: 'consoleAPICalled', handler: EventHandler<Runtime.ConsoleAPICalledEvent>): EventListener
    /** Issued when unhandled exception was revoked. */
    public on(event: 'exceptionRevoked', handler: EventHandler<Runtime.ExceptionRevokedEvent>): EventListener
    /** Issued when exception was thrown and unhandled. */
    public on(event: 'exceptionThrown', handler: EventHandler<Runtime.ExceptionThrownEvent>): EventListener
    /** Issued when new execution context is created. */
    public on(event: 'executionContextCreated', handler: EventHandler<Runtime.ExecutionContextCreatedEvent>): EventListener
    /** Issued when execution context is destroyed. */
    public on(event: 'executionContextDestroyed', handler: EventHandler<Runtime.ExecutionContextDestroyedEvent>): EventListener
    /** Issued when all executionContexts were cleared in browser */
    public on(event: 'executionContextsCleared', handler: EventHandler<Runtime.ExecutionContextsClearedEvent>): EventListener
    /** Issued when object should be inspected (for example, as a result of inspect() command line API call). */
    public on(event: 'inspectRequested', handler: EventHandler<Runtime.InspectRequestedEvent>): EventListener
    public on(event: string, handler: EventHandler<any>): EventListener {
      return this.events.on(event, handler)
    }
    /** Notification is issued every time when binding is called. */
    public once(event: 'bindingCalled', handler: EventHandler<Runtime.BindingCalledEvent>): EventListener
    /** Issued when console API was called. */
    public once(event: 'consoleAPICalled', handler: EventHandler<Runtime.ConsoleAPICalledEvent>): EventListener
    /** Issued when unhandled exception was revoked. */
    public once(event: 'exceptionRevoked', handler: EventHandler<Runtime.ExceptionRevokedEvent>): EventListener
    /** Issued when exception was thrown and unhandled. */
    public once(event: 'exceptionThrown', handler: EventHandler<Runtime.ExceptionThrownEvent>): EventListener
    /** Issued when new execution context is created. */
    public once(event: 'executionContextCreated', handler: EventHandler<Runtime.ExecutionContextCreatedEvent>): EventListener
    /** Issued when execution context is destroyed. */
    public once(event: 'executionContextDestroyed', handler: EventHandler<Runtime.ExecutionContextDestroyedEvent>): EventListener
    /** Issued when all executionContexts were cleared in browser */
    public once(event: 'executionContextsCleared', handler: EventHandler<Runtime.ExecutionContextsClearedEvent>): EventListener
    /** Issued when object should be inspected (for example, as a result of inspect() command line API call). */
    public once(event: 'inspectRequested', handler: EventHandler<Runtime.InspectRequestedEvent>): EventListener
    public once(event: string, handler: EventHandler<any>): EventListener {
      return this.events.once(event, handler)
    }
  }
  export class Schema {
    private readonly events: Events
    constructor(private readonly adapter: DevToolsAdapter) {
      this.events = new Events()
    }
    /** Returns supported domains. */
    public getDomains(request: Schema.GetDomainsRequest): Promise<Schema.GetDomainsResponse> {
      return this.adapter.call('Schema.getDomains', request)
    }
  }
  export class DevTools {
    public readonly Accessibility: Accessibility
    public readonly Animation: Animation
    public readonly ApplicationCache: ApplicationCache
    public readonly Audits: Audits
    public readonly BackgroundService: BackgroundService
    public readonly Browser: Browser
    public readonly CSS: CSS
    public readonly CacheStorage: CacheStorage
    public readonly Cast: Cast
    public readonly DOM: DOM
    public readonly DOMDebugger: DOMDebugger
    public readonly DOMSnapshot: DOMSnapshot
    public readonly DOMStorage: DOMStorage
    public readonly Database: Database
    public readonly DeviceOrientation: DeviceOrientation
    public readonly Emulation: Emulation
    public readonly HeadlessExperimental: HeadlessExperimental
    public readonly IO: IO
    public readonly IndexedDB: IndexedDB
    public readonly Input: Input
    public readonly Inspector: Inspector
    public readonly LayerTree: LayerTree
    public readonly Log: Log
    public readonly Memory: Memory
    public readonly Network: Network
    public readonly Overlay: Overlay
    public readonly Page: Page
    public readonly Performance: Performance
    public readonly Security: Security
    public readonly ServiceWorker: ServiceWorker
    public readonly Storage: Storage
    public readonly SystemInfo: SystemInfo
    public readonly Target: Target
    public readonly Tethering: Tethering
    public readonly Tracing: Tracing
    public readonly Fetch: Fetch
    public readonly WebAudio: WebAudio
    public readonly WebAuthn: WebAuthn
    public readonly Console: Console
    public readonly Debugger: Debugger
    public readonly HeapProfiler: HeapProfiler
    public readonly Profiler: Profiler
    public readonly Runtime: Runtime
    public readonly Schema: Schema
    constructor(private readonly adapter: DevToolsAdapter) {
      this.Accessibility = new Accessibility(this.adapter)
      this.Animation = new Animation(this.adapter)
      this.ApplicationCache = new ApplicationCache(this.adapter)
      this.Audits = new Audits(this.adapter)
      this.BackgroundService = new BackgroundService(this.adapter)
      this.Browser = new Browser(this.adapter)
      this.CSS = new CSS(this.adapter)
      this.CacheStorage = new CacheStorage(this.adapter)
      this.Cast = new Cast(this.adapter)
      this.DOM = new DOM(this.adapter)
      this.DOMDebugger = new DOMDebugger(this.adapter)
      this.DOMSnapshot = new DOMSnapshot(this.adapter)
      this.DOMStorage = new DOMStorage(this.adapter)
      this.Database = new Database(this.adapter)
      this.DeviceOrientation = new DeviceOrientation(this.adapter)
      this.Emulation = new Emulation(this.adapter)
      this.HeadlessExperimental = new HeadlessExperimental(this.adapter)
      this.IO = new IO(this.adapter)
      this.IndexedDB = new IndexedDB(this.adapter)
      this.Input = new Input(this.adapter)
      this.Inspector = new Inspector(this.adapter)
      this.LayerTree = new LayerTree(this.adapter)
      this.Log = new Log(this.adapter)
      this.Memory = new Memory(this.adapter)
      this.Network = new Network(this.adapter)
      this.Overlay = new Overlay(this.adapter)
      this.Page = new Page(this.adapter)
      this.Performance = new Performance(this.adapter)
      this.Security = new Security(this.adapter)
      this.ServiceWorker = new ServiceWorker(this.adapter)
      this.Storage = new Storage(this.adapter)
      this.SystemInfo = new SystemInfo(this.adapter)
      this.Target = new Target(this.adapter)
      this.Tethering = new Tethering(this.adapter)
      this.Tracing = new Tracing(this.adapter)
      this.Fetch = new Fetch(this.adapter)
      this.WebAudio = new WebAudio(this.adapter)
      this.WebAuthn = new WebAuthn(this.adapter)
      this.Console = new Console(this.adapter)
      this.Debugger = new Debugger(this.adapter)
      this.HeapProfiler = new HeapProfiler(this.adapter)
      this.Profiler = new Profiler(this.adapter)
      this.Runtime = new Runtime(this.adapter)
      this.Schema = new Schema(this.adapter)
    }
  }
}
