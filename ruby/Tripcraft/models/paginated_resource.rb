class PaginatedResource < ActiveResource::Collection
  attr_accessor :itemsCount
  def initialize(parsed = {})
    @elements = parsed['items']
    @itemsCount = parsed['total_count']
  end
end
