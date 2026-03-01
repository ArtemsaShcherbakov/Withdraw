import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WithdrawForm } from "@/components/WithdrawForm";

import { useWithdrawalStore } from "@/store/withdrawalStore";

import { IWithdrawalState } from "@/store/withdrawalStore/types";

jest.mock("@/store/withdrawalStore");
jest.mock("@/services/withdrawalService");

const mockCreateWithdrawal = jest.fn();
const mockUseWithdrawalStore = useWithdrawalStore as jest.MockedFunction<
  typeof useWithdrawalStore
>;

const createMockStore = (
  overrides?: Partial<IWithdrawalState>,
): IWithdrawalState =>
  ({
    createWithdrawal: mockCreateWithdrawal,
    status: "idle",
    error: null,
    currentWithdrawal: null,
    clearError: jest.fn(),
    lastUpdated: null,
    fetchWithdrawal: jest.fn(),
    resetState: jest.fn(),
    ...overrides,
  }) as IWithdrawalState;

describe("WithdrawForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseWithdrawalStore.mockImplementation((selector) => {
      const state = createMockStore();
      return selector ? selector(state) : state;
    });
  });

  test("happy-path: successful form submission", async () => {
    mockCreateWithdrawal.mockResolvedValueOnce({
      id: "123",
      status: "pending",
    });

    render(<WithdrawForm />);

    const amountInput = screen.getByRole("textbox", { name: /amount/i });
    const destinationInput = screen.getByRole("textbox", {
      name: /destination/i,
    });
    const confirmCheckbox = screen.getByRole("checkbox", {
      name: /i confirm/i,
    });
    const submitButton = screen.getByRole("button", { name: /withdraw/i });

    await userEvent.type(amountInput, "100");
    await userEvent.type(
      destinationInput,
      "0x1234567890123456789012345678901234567890",
    );
    await userEvent.click(confirmCheckbox);

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateWithdrawal).toHaveBeenCalledWith({
        amount: 100,
        destination: "0x1234567890123456789012345678901234567890",
      });
    });
  });

  test("error handling: API error shows user-friendly message", async () => {
    const errorMessage = "Network error. Please try again.";
    mockCreateWithdrawal.mockRejectedValueOnce(new Error(errorMessage));

    mockUseWithdrawalStore.mockImplementation((selector) => {
      const state = createMockStore({
        status: "error",
        error: errorMessage,
      });

      return selector ? selector(state) : state;
    });

    render(<WithdrawForm />);

    const amountInput = screen.getByRole("textbox", { name: /amount/i });
    const destinationInput = screen.getByRole("textbox", {
      name: /destination/i,
    });
    const confirmCheckbox = screen.getByRole("checkbox", {
      name: /i confirm/i,
    });

    await userEvent.type(amountInput, "100");
    await userEvent.type(
      destinationInput,
      "0x1234567890123456789012345678901234567890",
    );
    await userEvent.click(confirmCheckbox);

    await userEvent.click(screen.getByRole("button", { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("double submission protection", async () => {
    let submitCount = 0;
    mockCreateWithdrawal.mockImplementation(async () => {
      submitCount++;

      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    mockUseWithdrawalStore.mockImplementation((selector) => {
      const state = createMockStore({
        status: submitCount > 0 ? "loading" : "idle",
      });

      return selector ? selector(state) : state;
    });

    render(<WithdrawForm />);

    const amountInput = screen.getByRole("textbox", { name: /amount/i });
    const destinationInput = screen.getByRole("textbox", {
      name: /destination/i,
    });
    const confirmCheckbox = screen.getByRole("checkbox", {
      name: /i confirm/i,
    });

    await userEvent.type(amountInput, "100");
    await userEvent.type(
      destinationInput,
      "0x1234567890123456789012345678901234567890",
    );
    await userEvent.click(confirmCheckbox);

    const submitButton = screen.getByRole("button", { name: /withdraw/i });

    await userEvent.click(submitButton);
    await userEvent.click(submitButton);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateWithdrawal).toHaveBeenCalledTimes(1);
    });
  });

  test("form validation: prevents submission with invalid data", async () => {
    render(<WithdrawForm />);

    const submitButton = screen.getByRole("button", { name: /withdraw/i });

    expect(submitButton).toBeDisabled();

    const amountInput = screen.getByRole("textbox", { name: /amount/i });

    await userEvent.type(amountInput, "-100");

    fireEvent.blur(amountInput);

    expect(
      screen.getByText(/amount must be greater than 0/i),
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, "100");

    expect(submitButton).toBeDisabled();

    const destinationInput = screen.getByRole("textbox", {
      name: /destination/i,
    });

    await userEvent.type(
      destinationInput,
      "0x1234567890123456789012345678901234567890",
    );

    expect(submitButton).toBeDisabled();

    const confirmCheckbox = screen.getByRole("checkbox", {
      name: /i confirm/i,
    });
    await userEvent.click(confirmCheckbox);

    expect(submitButton).not.toBeDisabled();
  });
});
