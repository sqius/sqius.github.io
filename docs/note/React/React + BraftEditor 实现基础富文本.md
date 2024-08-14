# React + BraftEditor 实现基础富文本

## 😊 BraftEditor
[（BraftEditor）](https://www.npmjs.com/package/braft-editor)一个基于draft-js的Web富文本编辑器，适用于React框架，兼容主流现代浏览器。

![](../image/2024-04-02/react+braftteEditor-1.jpg)

## 😊 安装 BraftEditor
``` bash
yarn add braft-editor
```

## 😊 实现 基础的富文本组件
1. 创建组件
``` bash
mkdir RichText
cd RichiText
touch index.tsx controls.ts
```

2. controls.ts
这里主要是富文本编辑器的一些默认配置，更多配置可以查询[（文档）](https://www.yuque.com/braft-editor/be/gz44tn?inner=228cedf3)
``` ts
export const richTextControls: any = [
  'undo',
  'redo',

  'separator',
  'headings',
  'font-size',
  'line-height',
  'letter-spacing',

  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',

  'separator',
  'superscript',
  'subscript',
  'remove-styles',
  'emoji',

  'separator',
  'text-indent',
  'text-align',

  'separator',
  'list-ul',
  'list-ol',
  'blockquote',
  'code',

  'separator',
  'link',

  'separator',
  'hr',

  'separator',
  'media',

  'separator',
  'clear',
  'fullscreen',
];
```

3. index.tsx
``` tsx

import { useEffect, useState, CSSProperties } from 'react';
// 系统静态文件公共上传方法
import { staticResourceUpload, richTextQuery} from '../../common/services/system';
import { richTextControls } from './controls';

// 引入编辑器及样式
import BraftEditor, { MediaType } from 'braft-editor';
import 'braft-editor/dist/index.css';

// 这里可以利用 useEffect 自定义一个执行函数
const useMount = (callback: () => void) => {
  return useEffect(() => {
    return callback();
  }, []);
};

type Props = {
  id: string;
  readOnly?: boolean;
  onChange?: (content?: string) => void;
};

export default (props: Props) => {
  const { readOnly } = props;

  // 创建 state 用来存储 内容
  const [richValue, setRichValue] = useState<string>(BraftEditor.createEditorState(null));

  // 这里可以同步向外传递 富文本内容
  const handleSetRichValue = (v: string | { toHTML: any }) => {
    setRichValue(BraftEditor.createEditorState(v));
    props?.onChange?.(typeof v === 'string' ? v : v?.toHTML());
  };

  // 根据 ID 查询当前内容
  const fetchRichTextContent = async () => {
    if (!props?.id) return;
    const res = await richTextQuery?.({ id: props.id });
    if (res?.status !== 'SUCCESS') return;
    const { content } = res;
    handleSetRichValue(content || '');
  };

  // 处理媒体上传 图片 ｜ 视频
  const handleFetchUploadFinish = (res: FETCH.Res, uploadCall: any) => {
    if (res?.status !== 'SUCCESS') {
      uploadCall.error(res?.message);
      return;
    }
    /** 指定音视频是否循环播放|是否自动播放|是否显示控制栏 */
    const meta = { loop: true, autoPlay: true, controls: true, },
    uploadCall.success({ url: res?.videoPath, meta });
  };

  const handleMediaUpload :MediaType['uploadFn'] = async (uploadCall) => {
    if (!uploadCall?.file) return;
    /** 这里使用 FORMDATA 发送文件流的方案 */
    const formData = new FormData();
    formData.append('file', uploadCall?.file);
    const res = await staticResourceUpload(formData);
    handleFetchUploadFinish(res, uploadCall)
  };

  // 来一点样式
  const contentStyle: CSSProperties = {
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
    height: 460,
  };

  // 初始化查询
  useMount(fetchRichTextContent)

  return (
    <section className="rich-text-wrapper">
      <BraftEditor
        media={{ uploadFn: handleMediaUpload }}
        onChange={handleSetRichValue}
        controls={richTextControls}
        contentStyle={contentStyle}
        readOnly={readOnly}
        contentFormat="html"
        placeholder="请输入"
        value={richValue}
      />
    </section>
  );
};
```

## 😊 createEditorState 方法
可以使用 `BraftEditor.createEditorState` 方法来将 `raw`或者 `html`格式的数据转换成 `editorState` 数据

``` tsx
// 引入EditorState
import BraftEditor from 'braft-editor'

// 将raw格式的数据转换成editorState
const rawString = `{"blocks":[{"key":"9hu83","text":"Hello World!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":6,"length":5,"style":"BOLD"},{"offset":6,"length":5,"style":"COLOR-F32784"}],"entityRanges":[],"data":{}}],"entityMap":{}}`
const editorState = BraftEditor.createEditorState(rawString)

// 将html字符串转换成editorState
const htmlString = `<p>Hello <b>World!</b></p>`
const editorState2 = BraftEditor.createEditorState(htmlString)
```

将 `editorState` 数据转换成 `raw` 或者 `html`
``` tsx
// 将editorState数据转换成RAW字符串
const rawString = editorState.toRAW()

// editorState.toRAW()方法接收一个布尔值参数，用于决定是否返回RAW JSON对象，默认是false
const rawJSON = editorState.toRAW(true)

// 将editorState数据转换成html字符串
const htmlString = editorState.toHTML()
```

:::tip
在实际项目中，`editorState` 对象无法用于展示也无法用于持久化存储,

需要将其转换为html字符串来进行展示，用于持久化时则建议转换成 `raw` 格式。

`raw` 格式是一种可以用于无损持久化的数据格式，形式上是一段 `JSON`，
推荐使用这种格式来用于数据持久化。

虽然 `html` 字符串也可以用于持久化存储，但是对于比较复杂的富文本内容，在反复编辑的过程中，可能会存在格式丢失的情况，

比较标准的做法是在数据库中同时存储 `raw` 字符串和 `html` 字符串，分别用于再次编辑和前台展示。

:::