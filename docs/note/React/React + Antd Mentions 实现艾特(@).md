# React + Antd Mentions 实现艾特(@)

``` tsx
import { Mentions } from 'antd';
import { useCallback, useState } from 'react';
import { MentionsUsersListItem } from '../../process/ProcessHistory/typing';
import { sysNoticeUserSearch } from '../../views/system/User/services';
import debounce from 'lodash/debounce';

const { Option } = Mentions;

export type MentionsProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

export default (props: MentionsProps) => {
  const [loading, setLoading] = useState(false);
  const [mentionsUsers, setMentionsUsers] = useState<MentionsUsersListItem[]>();

  // 模糊查询用户
  const loadMentionsUsers = async (key: string) => {
    if (!key) {
      setMentionsUsers([]);
      return;
    }
    const res = await sysNoticeUserSearch(key);
    setLoading(false);
    setMentionsUsers(res?.rows);
  };

  // 800ms 防抖
  const debounceLoadMentionsUsers = useCallback(debounce(loadMentionsUsers, 800), []);

  const onSearch = (search: string) => {
    setLoading(!!search);
    setMentionsUsers([]);
    debounceLoadMentionsUsers(search);
  };

  const getNoticeParams = (noticePerson: string) => {
    const persons = noticePerson?.split(',')?.map((item) => item.trim());
    if (persons?.[persons.length - 1] === '') {
      persons.pop();
    }
    return persons?.join(',');
  };

  const onMentionsChange = (noticePerson: string) => {
    const value = getNoticeParams(noticePerson);
    props.onChange?.(value);
  };

  return (
    <Mentions
      loading={loading}
      onSearch={onSearch}
      onChange={onMentionsChange}
      placeholder="@ 员工号、员工名字"
      style={{ width: '100%' }}
      autoSize
    >
      {mentionsUsers?.map(({ userName, userRealname }, index) => (
        <Option
          key={index + ''}
          value={userName + ':' + userRealname + ','}
          className="antd-demo-dynamic-option"
        >
          <span>{userName + ':' + userRealname}</span>
        </Option>
      ))}
    </Mentions>
  );
};
```