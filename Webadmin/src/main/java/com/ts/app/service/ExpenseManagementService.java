package com.ts.app.service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.CategoryWiseExpense;
import com.ts.app.domain.Expense;
import com.ts.app.domain.ExpenseCategory;
import com.ts.app.domain.Site;
import com.ts.app.repository.ExpenseCategoryRepository;
import com.ts.app.repository.ExpenseRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExpenseDTO;

@Service
@Transactional
public class ExpenseManagementService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(FeedbackService.class);

	@Inject
	private ExpenseRepository expenseRepository;

	@Inject
	private ExpenseCategoryRepository expenseCategoryRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public ExpenseDTO saveExpense(ExpenseDTO expenseDTO) {

		Expense expense = new Expense();

		Expense previousExpenseDetails = new Expense();

		ExpenseDTO expenseDTO1;

		if (expenseDTO.getSiteId() > 0) {
			Site site = siteRepository.findOne(expenseDTO.getSiteId());
			expense.setSite(site);

			previousExpenseDetails = findLatestRecordBySite(expenseDTO.getSiteId());
		}

		expense.setMode(expenseDTO.getMode());
		expense.setCurrency(expenseDTO.getCurrency());
		expense.setPaymentType(expenseDTO.getPaymentType());
		expense.setBillable(expenseDTO.isBillable());
		expense.setReimbursable(expenseDTO.isReimbursable());
		expense.setDescription(expenseDTO.getDescription());
		// expense.setBalanceAmount(expenseDTO.getBalanceAmount());
		if (expenseDTO.getExpenseDate() != null) {
			expense.setExpenseDate(expenseDTO.getExpenseDate());
		}

		if (Objects.equals(expenseDTO.getMode(), "debit")) {
			expense.setExpenseCategory(expenseDTO.getExpenseCategory());
			expense.setBalanceAmount(previousExpenseDetails.getBalanceAmount() - expenseDTO.getDebitAmount());
			expense.setDebitAmount(expenseDTO.getDebitAmount());
		}

		if (Objects.equals(expenseDTO.getMode(), "credit")) {
			if (previousExpenseDetails.getBalanceAmount() > 0) {
				expense.setBalanceAmount(previousExpenseDetails.getBalanceAmount() + expenseDTO.getCreditAmount());
				expense.setCreditAmount(expenseDTO.getCreditAmount());

			} else {
				expense.setCreditAmount(expenseDTO.getCreditAmount());
			}

		}

		Expense saveResult = expenseRepository.save(expense);

		expenseDTO1 = mapperUtil.toModel(saveResult, ExpenseDTO.class);

		log.info("Expense saved - --------------" + expenseDTO1.getMode());

		return expenseDTO1;
	}

	public List<ExpenseDTO> findAll(int currPage) {
		Pageable pageRequest = createPageRequest(currPage);
		Page<Expense> result = expenseRepository.findAll(pageRequest);
		return mapperUtil.toModelList(result.getContent(), ExpenseDTO.class);
	}

	public List<ExpenseCategory> findAllExpenseCategories() {
		return expenseCategoryRepository.findAll();
	}

	public Expense findLatestRecordBySite(long siteId) {
		List<Expense> expenseList = expenseRepository.findLatestEntryBySite(siteId);

		if (expenseList.isEmpty()) {
			return null;
		} else {
			return expenseList.get(0);
		}
	}
	
	/**
	 * Returns the expenses grouped by expense categories for a site.
	 * @param siteId
	 * @param fromDate
	 * @param toDate
	 * @return
	 */
	public List<CategoryWiseExpense> findExpenseByCategories(long siteId, Date fromDate, Date toDate) {
		if(fromDate != null) {
			toDate = (toDate == null ? fromDate : toDate);
			Timestamp fromTS = DateUtil.convertToTimestamp(fromDate);
			Timestamp toTS = DateUtil.convertToTimestamp(toDate);
			return expenseRepository.getCategoryWiseExpenseBySite(siteId, fromTS, toTS);
		}
		return expenseRepository.getCategoryWiseExpenseBySite(siteId);
	}
	
	/**
	 * Returns the expenses for a particular expense category for a site.
	 * @param siteId
	 * @param category
	 * @param fromDate
	 * @param toDate
	 * @return
	 */
	public List<ExpenseDTO> findExpenseByCategory(long siteId, String category, Date fromDate, Date toDate) {
		List<ExpenseDTO> expenses = null;
		if(fromDate != null) {
			toDate = (toDate == null ? fromDate : toDate);
			Timestamp fromTS = DateUtil.convertToTimestamp(fromDate);
			Timestamp toTS = DateUtil.convertToTimestamp(toDate);
			List<Expense> expenseEntities = expenseRepository.getCategoryExpenseBySite(siteId, category, fromTS, toTS);
			if(CollectionUtils.isNotEmpty(expenseEntities)) {
				expenses = mapperUtil.toModelList(expenseEntities, ExpenseDTO.class);
			}
		}else {
			List<Expense> expenseEntities = expenseRepository.getCategoryExpenseBySite(siteId, category);
			if(CollectionUtils.isNotEmpty(expenseEntities)) {
				expenses = mapperUtil.toModelList(expenseEntities, ExpenseDTO.class);
			}
		}
		return expenses;
	}
}
