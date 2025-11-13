import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorLogs } from "../ErrorLogs";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        loading: "読み込み中...",
        errorLogs: "エラーログ一覧",
        filter: "フィルター",
        all: "全て",
        error: "エラー",
        warning: "警告",
        info: "情報",
        notErrorLogs: "エラーログはありません",
        deleteAll: "全て削除",
        date: "日付",
        level: "レベル",
        message: "メッセージ",
        page: "ページ",
        delete: "削除",
        noDetails: "詳細なし",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../hooks", () => ({
  useErrorLogs: jest.fn(),
}));

const { useErrorLogs } = jest.requireMock("../hooks");

describe("ErrorLogs コンポーネント", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loading 中はローディングを表示する", () => {
    useErrorLogs.mockReturnValue({
      logs: [],
      loading: true,
      openId: null,
      toggleDetails: jest.fn(),
      handleDeleteAllLogs: jest.fn(),
      handleDeleteLog: jest.fn(),
      filter: "all",
      setFilter: jest.fn(),
    });

    render(<ErrorLogs />);
    expect(screen.getAllByText("読み込み中...")[0]).toBeInTheDocument();
  });

  it("ログがない場合はメッセージを表示する", () => {
    useErrorLogs.mockReturnValue({
      logs: [],
      loading: false,
      openId: null,
      toggleDetails: jest.fn(),
      handleDeleteAllLogs: jest.fn(),
      handleDeleteLog: jest.fn(),
      filter: "all",
      setFilter: jest.fn(),
    });

    render(<ErrorLogs />);
    expect(
      screen.getByRole("heading", { name: "エラーログ一覧" })
    ).toBeInTheDocument();
    expect(screen.getByText("エラーログはありません")).toBeInTheDocument();
  });

  it("ログがある場合はテーブルとアクションを表示する", () => {
    const toggleDetailsMock = jest.fn();
    const handleDeleteAllLogsMock = jest.fn();
    const handleDeleteLogMock = jest.fn();

    useErrorLogs.mockReturnValue({
      logs: [
        {
          id: "1",
          timestamp: new Date("2025-01-01"),
          level: "error",
          message: "エラー1",
          page: "/home",
          details: "詳細1",
        },
        {
          id: "2",
          timestamp: new Date("2025-01-02"),
          level: "warning",
          message: "警告1",
          page: "/about",
          details: "詳細2",
        },
      ],
      loading: false,
      openId: null,
      toggleDetails: toggleDetailsMock,
      handleDeleteAllLogs: handleDeleteAllLogsMock,
      handleDeleteLog: handleDeleteLogMock,
      filter: "all",
      setFilter: jest.fn(),
    });

    render(<ErrorLogs />);

    fireEvent.click(screen.getByText("全て削除"));
    expect(handleDeleteAllLogsMock).toHaveBeenCalled();

    const deleteButton = screen.getAllByRole("button", { name: "削除" })[0];
    fireEvent.click(deleteButton);
    expect(handleDeleteLogMock).toHaveBeenCalledWith("1");

    const firstRowCell = screen.getAllByText("エラー1")[0].closest("tr")!;
    fireEvent.click(firstRowCell);
    expect(toggleDetailsMock).toHaveBeenCalledWith("1");
  });

  it("詳細が展開されている場合は detailsRow を表示する", () => {
    useErrorLogs.mockReturnValue({
      logs: [
        {
          id: "1",
          timestamp: new Date("2025-01-01"),
          level: "error",
          message: "エラー1",
          page: "/home",
          details: "詳細1",
        },
      ],
      loading: false,
      openId: "1",
      toggleDetails: jest.fn(),
      handleDeleteAllLogs: jest.fn(),
      handleDeleteLog: jest.fn(),
      filter: "all",
      setFilter: jest.fn(),
    });

    render(<ErrorLogs />);

    const detailsElements = screen.getAllByText("詳細1");
    expect(detailsElements[0]).toBeInTheDocument();
  });

  it("details がない場合は '詳細なし' を表示する", () => {
    useErrorLogs.mockReturnValue({
      logs: [
        {
          id: "1",
          timestamp: new Date("2025-01-01"),
          level: "error",
          message: "エラー1",
          page: "/home",
          details: null,
        },
      ],
      loading: false,
      openId: "1",
      toggleDetails: jest.fn(),
      handleDeleteAllLogs: jest.fn(),
      handleDeleteLog: jest.fn(),
      filter: "all",
      setFilter: jest.fn(),
    });

    render(<ErrorLogs />);
    expect(screen.getByText("詳細なし")).toBeInTheDocument();
  });

  it("フィルター選択を変更したら setFilter が呼ばれる", () => {
    const setFilterMock = jest.fn();

    useErrorLogs.mockReturnValue({
      logs: [],
      loading: false,
      openId: null,
      toggleDetails: jest.fn(),
      handleDeleteAllLogs: jest.fn(),
      handleDeleteLog: jest.fn(),
      filter: "all",
      setFilter: setFilterMock,
    });

    render(<ErrorLogs />);
    const select = screen.getByLabelText("フィルター：");
    fireEvent.change(select, { target: { value: "error" } });
    expect(setFilterMock).toHaveBeenCalledWith("error");
  });
});
